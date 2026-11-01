import test from 'node:test';import assert from 'node:assert/strict';
import {intakeOpenFailureMessage} from '../public/previsit-error.mjs';

test('quota failures are not mislabeled as internet failures',()=>{
 const message=intakeOpenFailureMessage('functions/resource-exhausted');
 assert.ok(message.includes('確認の回数が多くなりました'));
 assert.ok(message.includes('問診票は再送されません'));
 assert.ok(!message.includes('ネット'));
});

test('permission failures give a safe doctor-facing recovery step',()=>{
 assert.ok(intakeOpenFailureMessage('functions/permission-denied').includes('医師のログイン'));
});

test('transport failures explain that already-entered content is not resent',()=>{
 assert.ok(intakeOpenFailureMessage('functions/unavailable').includes('送信し直すことはありません'));
});
