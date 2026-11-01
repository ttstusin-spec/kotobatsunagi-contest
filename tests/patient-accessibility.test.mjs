import {test} from 'node:test';
import assert from 'node:assert/strict';
import {patientScale,patientConsentAction,PATIENT_STEPS} from '../public/patient-accessibility.mjs';
test('patient happy path has two steps, 100/150/200 percent text, no unsupported scaling',()=>{assert.equal(PATIENT_STEPS.length,2);for(const scale of [1,1.5,2])assert.equal(patientScale(String(scale)),scale);for(const scale of [0,-1,3,'oops'])assert.throws(()=>patientScale(scale));});
test('join button is explicit call consent only after valid invite; AI consent stays separate',async()=>{let allowed=false,started=0;const consent={checked:false},ai={checked:false},join=patientConsentAction({allowed:()=>allowed,consent,start:async()=>started++});await join();assert.equal(started,0);assert.equal(consent.checked,false);allowed=true;await join();assert.equal(started,1);assert.equal(consent.checked,true);assert.equal(ai.checked,false);});
