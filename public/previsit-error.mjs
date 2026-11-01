export function intakeOpenFailureMessage(code){
 const value=String(code||'').toLowerCase();
 if(value.endsWith('resource-exhausted'))return '確認の回数が多くなりました。少し待ってから、もう一度お試しください。問診票は再送されません。';
 if(value.endsWith('permission-denied')||value.endsWith('unauthenticated'))return '医師のログインか患者さんの選択を確認して、もう一度お試しください。';
 if(value.endsWith('not-found'))return '問診票が見つかりません。患者さんを選び直すか、新しい問診票リンクを作ってください。';
 return 'ネットの接続が不安定か、サーバーが応答していません。接続を確認して、もう一度お試しください。入力や通話の内容を送信し直すことはありません。';
}
