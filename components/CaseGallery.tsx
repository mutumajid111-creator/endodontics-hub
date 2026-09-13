"use client";

import { useEffect, useId, useRef, useState, type PointerEvent } from "react";
import styles from "./CaseGallery.module.css";

export type ClinicalImage = { id: string; url?: string; image_type: string; caption: string | null };
type Point = { x: number; y: number };
type View = Point & { scale: number };
const fit: View = { scale: 1, x: 0, y: 0 };
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function Thumbnails({ images, active, select }: { images: ClinicalImage[]; active: number; select: (index: number) => void }) {
  const strip = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = strip.current;
    const button = root?.children[active] as HTMLElement | undefined;
    if (root && button) {
      const left = button.offsetLeft;
      if (left < root.scrollLeft) root.scrollLeft = left;
      else if (left + button.offsetWidth > root.scrollLeft + root.clientWidth) root.scrollLeft = left + button.offsetWidth - root.clientWidth;
    }
  }, [active]);
  return <div className={styles.thumbnails} ref={strip} aria-label="Choose a clinical image">
    {images.map((image, index) => <button type="button" key={image.id} aria-label={`Image ${index + 1}: ${image.caption || image.image_type}`} aria-pressed={index === active} onClick={() => select(index)}>
      {image.url && <img src={image.url} alt="" loading="lazy" onError={event => { event.currentTarget.style.visibility = "hidden"; }}/>}<span>{String(index + 1).padStart(2, "0")}</span>
    </button>)}
  </div>;
}

function ClinicalPhoto({ image, title }: { image: ClinicalImage; title: string }) {
  const [failed, setFailed] = useState(false);
  return image.url && !failed ? <img className={styles.previewImage} src={image.url} alt={image.caption || `${title} — ${image.image_type}`} onError={() => setFailed(true)}/> : <span className={styles.unavailable}>Image unavailable. Please reload the case to try again.</span>;
}

function ZoomImage({ image, title, navigate }: { image: ClinicalImage; title: string; navigate: (direction: number) => void }) {
  const stage = useRef<HTMLDivElement>(null);
  const photo = useRef<HTMLImageElement>(null);
  const current = useRef<View>(fit);
  const pointers = useRef(new Map<number, Point>());
  const gesture = useRef({ x: 0, y: 0, pinched: false, moved: false });
  const lastTap = useRef(0);
  const [view, setView] = useState<View>(fit);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(!image.url);

  function update(next: View) {
    const box = stage.current;
    const img = photo.current;
    const scale = clamp(next.scale, 1, 4);
    if (!box || !img?.naturalWidth) return;
    const ratio = Math.min(box.clientWidth / img.naturalWidth, box.clientHeight / img.naturalHeight);
    const maxX = Math.max(0, (img.naturalWidth * ratio * scale - box.clientWidth) / 2);
    const maxY = Math.max(0, (img.naturalHeight * ratio * scale - box.clientHeight) / 2);
    const result = { scale, x: clamp(next.x, -maxX, maxX), y: clamp(next.y, -maxY, maxY) };
    current.current = result;
    setView(result);
  }
  function zoom(scale: number, origin: Point = { x: 0, y: 0 }) {
    const old = current.current;
    const ratio = clamp(scale, 1, 4) / old.scale;
    update({ scale, x: origin.x + (old.x - origin.x) * ratio, y: origin.y + (old.y - origin.y) * ratio });
  }
  useEffect(() => {
    const box = stage.current;
    if (!box) return;
    const wheel = (event: WheelEvent) => {
      event.preventDefault();
      const bounds = box.getBoundingClientRect();
      zoom(current.current.scale * Math.exp(-event.deltaY * .002), { x: event.clientX - bounds.left - bounds.width / 2, y: event.clientY - bounds.top - bounds.height / 2 });
    };
    box.addEventListener("wheel", wheel, { passive: false });
    const resize = new ResizeObserver(() => update(current.current));
    resize.observe(box);
    return () => { box.removeEventListener("wheel", wheel); resize.disconnect(); };
  }, []);

  function down(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || !loaded || failed) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.current.size === 1) gesture.current = { x: event.clientX, y: event.clientY, pinched: false, moved: false };
    else gesture.current.pinched = true;
  }
  function move(event: PointerEvent<HTMLDivElement>) {
    const oldPoint = pointers.current.get(event.pointerId);
    if (!oldPoint) return;
    const before = [...pointers.current.values()];
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const after = [...pointers.current.values()];
    if (Math.hypot(event.clientX - gesture.current.x, event.clientY - gesture.current.y) > 6) gesture.current.moved = true;
    if (after.length === 2) {
      const distance = (points: Point[]) => Math.hypot(points[1].x - points[0].x, points[1].y - points[0].y);
      const bounds = event.currentTarget.getBoundingClientRect();
      const midpoint = (points: Point[]) => ({ x: (points[0].x + points[1].x) / 2 - bounds.left - bounds.width / 2, y: (points[0].y + points[1].y) / 2 - bounds.top - bounds.height / 2 });
      const start = midpoint(before), end = midpoint(after), old = current.current;
      const scale = clamp(old.scale * distance(after) / Math.max(distance(before), 1), 1, 4);
      update({ scale, x: end.x - (start.x - old.x) * scale / old.scale, y: end.y - (start.y - old.y) * scale / old.scale });
    } else if (after.length === 1 && current.current.scale > 1) {
      update({ ...current.current, x: current.current.x + event.clientX - oldPoint.x, y: current.current.y + event.clientY - oldPoint.y });
    }
  }
  function up(event: PointerEvent<HTMLDivElement>) {
    if (!pointers.current.has(event.pointerId)) return;
    pointers.current.delete(event.pointerId);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (pointers.current.size || event.type === "pointercancel" || gesture.current.pinched) return;
    const dx = event.clientX - gesture.current.x, dy = event.clientY - gesture.current.y;
    if (current.current.scale === 1 && Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.3) navigate(dx < 0 ? 1 : -1);
    else if (!gesture.current.moved) {
      const now = Date.now();
      if (now - lastTap.current < 300) { zoom(current.current.scale > 1 ? 1 : 2); lastTap.current = 0; }
      else lastTap.current = now;
    }
  }
  return <div className={styles.zoomWorkspace}>
    <div className={styles.zoomTools} aria-label="Image magnification">
      <button type="button" aria-label="Zoom out" disabled={!loaded || failed || view.scale <= 1} onClick={() => zoom(view.scale - .5)}>−</button>
      <output aria-label="Zoom level">{Math.round(view.scale * 100)}%</output>
      <button type="button" aria-label="Zoom in" disabled={!loaded || failed || view.scale >= 4} onClick={() => zoom(view.scale + .5)}>+</button>
      <button type="button" className={styles.fitButton} disabled={!loaded || failed} onClick={() => update(fit)}>Fit image</button>
    </div>
    <div ref={stage} className={styles.zoomStage} data-zoomed={view.scale > 1} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
      {failed ? <div className={styles.unavailable} role="status">Image unavailable.<br/>Close the viewer and reload the case to try again.</div> : <>
        {!loaded && <span className={styles.unavailable} role="status">Loading image…</span>}
        <img ref={photo} src={image.url} alt={image.caption || `${title} — ${image.image_type}`} draggable={false} onLoad={() => { setLoaded(true); update(fit); }} onError={() => setFailed(true)} style={{ opacity: loaded ? 1 : 0, transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})` }}/>
      </>}
    </div>
    <p className={styles.gestureHint}>Double-click or pinch to zoom · Drag to inspect · Swipe at 100% to browse</p>
  </div>;
}

function ImageViewer({ images, active, title, select, close }: { images: ClinicalImage[]; active: number; title: string; select: (index: number) => void; close: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const image = images[active];
  const navigate = (direction: number) => select((active + direction + images.length) % images.length);
  useEffect(() => {
    const element = dialog.current!;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = "hidden";
    return () => { element.close(); document.body.style.overflow = previousOverflow; previousFocus?.focus({ preventScroll: true }); };
  }, []);
  return <dialog ref={dialog} className={styles.viewer} aria-labelledby={titleId} onCancel={event => { event.preventDefault(); close(); }} onKeyDown={event => {
    if (event.key === "Tab") {
      const buttons = event.currentTarget.querySelectorAll<HTMLButtonElement>("button:not(:disabled)");
      const first = buttons[0], last = buttons[buttons.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); navigate(event.key === "ArrowRight" ? 1 : -1); }
  }}>
    <div className={styles.viewerHeader}><div><span>CLINICAL IMAGE VIEWER</span><h2 id={titleId}>{title}</h2></div><button type="button" className={styles.closeButton} aria-label="Close image viewer" onClick={close} autoFocus>✕</button></div>
    <ZoomImage key={`${image.id}:${image.url}`} image={image} title={title} navigate={navigate}/>
    <div className={styles.viewerFooter}>
      <div className={styles.imageNavigation}>
        <button type="button" aria-label="Previous image" disabled={images.length < 2} onClick={() => navigate(-1)}>←</button>
        <span aria-live="polite" aria-atomic="true">{String(active + 1).padStart(2, "0")} <span>/ {String(images.length).padStart(2, "0")}</span></span>
        <button type="button" aria-label="Next image" disabled={images.length < 2} onClick={() => navigate(1)}>→</button>
      </div>
      <div className={styles.caption}><span>{image.image_type.replaceAll("_", " ")}</span><p>{image.caption || `Clinical image ${active + 1}`}</p></div>
      <Thumbnails images={images} active={active} select={select}/>
    </div>
  </dialog>;
}

export default function CaseGallery({ images, title }: { images: ClinicalImage[]; title: string }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const index = Math.min(active, Math.max(0, images.length - 1));
  const selected = images[index];
  if (!selected) return <div className={styles.empty}>No images uploaded yet.</div>;
  const navigate = (direction: number) => setActive((index + direction + images.length) % images.length);
  return <div className={styles.gallery}>
    <div className={styles.galleryHeader}><div><span>THE CLINICAL GALLERY</span><p>{images.length} {images.length === 1 ? "image" : "images"} · Explore every detail</p></div><button type="button" onClick={() => setOpen(true)} aria-label="Open image viewer">Expand <span aria-hidden="true">⤢</span></button></div>
    <div className={styles.preview}>
      <button type="button" className={styles.openImage} onClick={() => setOpen(true)} aria-label={`Enlarge image ${index + 1}: ${selected.caption || selected.image_type}`}><ClinicalPhoto key={`${selected.id}:${selected.url}`} image={selected} title={title}/><span className={styles.previewHint}>⤢ Click to zoom & browse</span></button>
      {images.length > 1 && <><button type="button" className={`${styles.previewArrow} ${styles.previous}`} aria-label="Previous image" onClick={() => navigate(-1)}>←</button><button type="button" className={`${styles.previewArrow} ${styles.next}`} aria-label="Next image" onClick={() => navigate(1)}>→</button></>}
    </div>
    <div className={styles.previewCaption}><div className={styles.caption}><span>{selected.image_type.replaceAll("_", " ")}</span><p>{selected.caption || `Clinical image ${index + 1}`}</p></div><span className={styles.counter} aria-live="polite">{String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</span></div>
    <Thumbnails images={images} active={index} select={setActive}/>
    {open && <ImageViewer images={images} active={index} title={title} select={setActive} close={() => setOpen(false)}/>}
  </div>;
}
