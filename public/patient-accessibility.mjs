export const PATIENT_STEPS=['病院のリンクを開く','説明を読み、同意して診察に入る'];
export function patientScale(value){const n=Number(value);if(![1,1.5,2].includes(n))throw Error('FONT_SCALE_INVALID');return n;}
export function patientConsentAction({allowed,consent,start}){return async event=>{if(!allowed())return;consent.checked=true;return start(event);};}
export function mountPatientAccessibility({root,access,callBox}){
 let allowed=false,connected=false;const start=root.querySelector('#callStart'),end=root.querySelector('#callEnd'),consent=root.querySelector('#callConsent'),oldStart=start.onclick,label=consent.closest('label');label.hidden=true;
 const others=[...root.children].filter(e=>![start,end,label].includes(e)),details=document.createElement('details'),summary=document.createElement('summary');summary.textContent='字幕・その他の設定';details.append(summary,...others);
 const heading=document.createElement('h2');heading.textContent='診察に参加';const help=document.createElement('p');help.textContent='映像と声を相手に送ります。通話は録音しません。よければ下のボタンを押してください。字幕の送信は別に選びます。';help.id='patientConsentText';
 const status=document.createElement('p');status.setAttribute('role','status');status.textContent='病院からの招待を確認しています。';status.id='patientSimpleState';
 const sizeLabel=document.createElement('label'),size=document.createElement('select');size.id='patientFont';size.setAttribute('aria-label','患者画面の文字サイズ');for(const [value,text]of [['1','標準'],['1.5','大きく'],['2','最大（200%）']])size.append(new Option(text,value));sizeLabel.append(document.createTextNode('文字の大きさ '),size);
 const setScale=value=>{const scale=patientScale(value);document.body.style.setProperty('--patient-scale',String(scale));size.value=String(scale);};size.onchange=()=>setScale(size.value);
 const dock=document.createElement('div');dock.className='patient-actions';dock.setAttribute('aria-label','診察の操作');start.textContent='同意して診察に入る';start.className='big primary';start.setAttribute('aria-describedby',help.id);end.textContent='通話を終える';end.className='big danger';dock.append(start,end);start.disabled=true;end.disabled=true;
 start.onclick=patientConsentAction({allowed:()=>allowed&&!connected,consent,start:oldStart});
 root.replaceChildren(heading,sizeLabel,help,status,details,label,dock);callBox.prepend(root);
 for(const child of [...access.children])if(child.id!=='loginMsg')child.hidden=true;
 const resize=()=>document.body.style.setProperty('--patient-dock-height',dock.getBoundingClientRect().height+'px'),observer=new ResizeObserver(resize);observer.observe(dock);resize();
 const message=e=>{if(e.source===window.parent&&e.origin===location.origin&&e.data?.kind==='patient-preview-scale'){try{setScale(e.data.scale);}catch{}}};window.addEventListener('message',message);
 const update=()=>{start.disabled=!allowed||connected;end.disabled=!connected;status.textContent=connected?'つながりました。字幕は「字幕・その他の設定」で開始できます。':allowed?'準備できました。下のボタンから入れます。':'病院の招待リンクから開いてください。';};
 update();return {allow(value){const previous=allowed;allowed=value===true;access.hidden=allowed;if(previous&&!allowed)access.querySelector('#loginMsg').textContent='診察を終えたか、参加権限がありません。病院に新しい招待を頼んでください。';update();},connected(value){connected=value===true;update();},dispose(){observer.disconnect();window.removeEventListener('message',message);}};
}
