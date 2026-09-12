import { supabase } from "@/lib/supabase";

const DEVICE_KEY="eh_device_token";

export function getDeviceToken(){
  if(typeof window==="undefined") return "";
  let token=window.localStorage.getItem(DEVICE_KEY);
  if(!token){
    token=typeof crypto!=="undefined"&&"randomUUID" in crypto?crypto.randomUUID():`${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(DEVICE_KEY,token);
  }
  return token;
}

export async function claimThisDevice(){
  const token=getDeviceToken();
  if(!token)return false;
  const {data,error}=await supabase.rpc("claim_device_session",{p_device_token:token});
  return !error && data===true;
}

export async function ensureThisDevice(){
  const token=getDeviceToken();
  if(!token)return false;
  const {data,error}=await supabase.rpc("ensure_device_session",{p_device_token:token});
  if(error) return true;
  return data===true;
}

export async function isCurrentDevice(){
  const token=getDeviceToken();
  if(!token)return false;
  const {data,error}=await supabase.rpc("is_current_device",{p_device_token:token});
  if(error) return true;
  return data===true;
}
