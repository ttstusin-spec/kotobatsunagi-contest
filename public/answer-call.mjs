// Feedback starts in the click gesture. No media acquisition or server policy here.
export function mountAnswerCall({button,getSession,answer,onAccepted,onFailure=()=>{},onProgress=()=>{},unlock=()=>{}}){
 let busy=false;
 const run=async()=>{if(busy)return;const sid=getSession();if(!sid){onFailure('missing');return;}busy=true;const label=button.textContent;button.disabled=true;button.textContent='つないでいます…';
  try{onProgress();unlock();await answer(sid);await onAccepted(sid);}catch{onFailure('unavailable');}finally{busy=false;button.disabled=false;button.textContent=label;}
 };
 button.onclick=run;return {run,get busy(){return busy;}};
}
