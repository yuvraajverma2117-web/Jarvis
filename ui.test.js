import {test}from'node:test';import assert from'node:assert/strict';import fs from'node:fs/promises';import{JSDOM}from'jsdom';import{indexedDB,IDBKeyRange}from'fake-indexeddb';
import{read}from'../public/store.js';
test('UI state flows in a DOM simulation: profile, memory edit, task, note, review, focus, chat confirmation and persistence',async()=>{
 const dom=new JSDOM(await fs.readFile(new URL('../public/index.html',import.meta.url),'utf8'),{url:'http://localhost:3000',pretendToBeVisual:true});
 for(const k of ['window','document','location','history','sessionStorage','localStorage'])globalThis[k]=dom.window[k];
 Object.defineProperty(globalThis,'navigator',{value:dom.window.navigator,configurable:true});globalThis.indexedDB=indexedDB;globalThis.IDBKeyRange=IDBKeyRange;globalThis.confirm=()=>true;globalThis.prompt=()=>null;
 const originalInterval=globalThis.setInterval;globalThis.setInterval=(...args)=>originalInterval(...args).unref();
 await import('../public/app.js');const $=id=>document.getElementById(id);const pause=()=>new Promise(r=>setTimeout(r,30));const form=async id=>{$(id).dispatchEvent(new window.Event('submit',{bubbles:true,cancelable:true}));await pause();};const click=async id=>{$(id).click();await pause();};
 try{
 assert.equal($('notice').hidden,true);assert.match($('messages').textContent,/Start with/);
 await click('suggest-profile');assert.equal($('profile-name').value,'Yuvraaj');assert.equal((await read('state'))?.profile?.name,undefined);await form('profile-form');assert.equal((await read('state')).profile.name,'Yuvraaj');
 $('memory-text').value='I study mathematics for an olympiad';await form('memory-form');let s=await read('state');assert.equal(s.memories.length,1);assert.equal(s.memories[0].private,true);assert.equal($('memory-text').value,'');
 $('memory-list').querySelector('button').click();$('memory-text').value='I prefer short maths hints';await form('memory-form');assert.equal((await read('state')).memories.length,1);assert.equal((await read('state')).memories[0].text,'I prefer short maths hints');
 $('task-text').value='Review graph theory';$('task-due').value='2026-09-26T10:00';await form('task-form');const check=$('task-list').querySelector('input');check.checked=true;check.dispatchEvent(new window.Event('change'));await pause();assert.equal((await read('state')).tasks[0].done,true);
 $('note-title').value='Question';$('note-body').value='Why must odd degrees come in pairs?';await form('note-form');$('note-body').value='Sum of degrees equals twice the edges.';await form('note-form');assert.equal((await read('state')).notes.length,1);assert.match((await read('state')).notes[0].body,/twice/);
 $('card-question').value='Degree sum?';$('card-answer').value='Twice the edge count';await form('card-form');$('review').querySelector('button').click();assert.match($('review').textContent,/Twice the edge/);$('review').querySelectorAll('button')[1].click();await pause();assert.equal((await read('state')).cards[0].interval,1);
 await click('focus-start');assert.ok((await read('state')).focus.started);await click('focus-finish');assert.equal((await read('state')).focus.started,null);assert.equal((await read('state')).focus.sessions.length,1);
 $('chat-input').value='/remember I enjoy geometry';await form('chat-form');assert.equal((await read('state')).memories.length,1);assert.equal($('proposal').hidden,false);$('proposal').querySelector('button').click();await pause();assert.equal((await read('state')).memories.length,2);
 $('chat-input').value='/calc (8 + 2) * 3';await form('chat-form');assert.equal((await read('state')).chats.at(-1).text,'30');
 $('chat-input').value='/note <img src=x onerror=alert(1)>';await form('chat-form');assert.equal($('proposal').querySelector('img'),null);
 assert.equal($('notice').hidden,true);
 }finally{globalThis.setInterval=originalInterval;dom.window.close();}
});
