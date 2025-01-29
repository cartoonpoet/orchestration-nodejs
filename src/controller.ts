//Copyright 2024 Soul Machines Ltd

//Licensed under the Apache License, Version 2.0 (the "License");
//you may not use this file except in compliance with the License.
//You may obtain a copy of the License at

//http://www.apache.org/licenses/LICENSE-2.0

//Unless required by applicable law or agreed to in writing, software
//distributed under the License is distributed on an "AS IS" BASIS,
//WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//See the License for the specific language governing permissions and
//limitations under the License.

import { ConversationRequest, ConversationResponse, SMmessage } from 'interfaces';
import * as WebSocket from 'ws';
import {koreanToNumber, parseInput} from './utils/func'


export function handleMessage(ws: WebSocket, message: any) {
    try {
        const msg: SMmessage = JSON.parse(message);
        if (msg.name == 'conversationRequest') {
            let request: ConversationRequest = msg.body as ConversationRequest;
            if(request.optionalArgs?.fromCall === 'handleSpeak') handleRequest(ws, request);
        }
    } catch {
        console.log('Unrecognized message: ', message);
    }
}

export function handleRequest(ws: WebSocket, req: ConversationRequest) {
    console.log('Conv request: ', req);

    // Set a simple response
    let resp : ConversationResponse = {
        input: { text: req.input.text },
        output: { text: `Echo: ${req.input.text}` },
        variables: {}
    };

    const text = req.input.text.replace(/\s+/g, '');
    const work = req.variables.work;

    // Handle welcome message
    if (req.optionalArgs?.kind == 'init') {
        resp.output.text = '원하는 업무를 말씀해 주세요.';
    }
    else if (text.endsWith('돈보내줘') || text.endsWith('이체해줘')) {
        resp.output.text = '어떤 계좌에서 이체할까요? 첫번째 또는 저축예금통장으로 말씀해 주세요.';
        resp.fallback = true;
    }
    else if (text.includes('계좌조회')) {
        resp.output.text = '어떤 계좌에서 조회할까요? 첫번째 또는 저축예금통장으로 말씀해 주세요.';
        resp.fallback = true;
    }
    else if (text.includes('적금추천해줘')) {
        resp.output.text = '적금 상품의 원하는 입금방식을 선택해 주세요. 첫번째 또는 화면에 보이는 입금 방식을 말씀해 주세요.';
        resp.fallback = true;
    }
    else if (text.startsWith('고객센터')) {
        resp.output.text = '상담 방법을 선택해주세요. 첫번째 또는 상담 방법을 말씀해 주세요.';
        resp.fallback = true;
    }
    else if (text.includes('번째')) {
        if(work === 'Transfer') resp.output.text = '누구에게 보낼까요? 최근 이체한 계좌도 함께 보여드릴께요.';
        else if(work === 'Account') resp.output.text = '잔액은 백이십삼십사만오천육백원이에요.';
        else if(work === 'Savings') resp.output.text = '고객님께 적합한 자유적립식 적금 상품을 추천해 드릴게요. 첫번째 또는 화면에 보이는 상품 이름을 말씀해 주세요.';
        else if(work === 'CallCenter') resp.output.text = '상담 유형을 선택해 주세요. 첫번째 또는 상담 유형을 말씀해 주세요.';
        resp.fallback = true;
    }
    else if (text.includes('통장')) {
        if(work === 'Transfer') resp.output.text = '누구에게 보낼까요? 최근 이체한 계좌도 함께 보여드릴께요.';
        else if(work === 'Account') resp.output.text = '잔액은 백이십삼십사만오천육백원이에요.';
        resp.fallback = true;
    }
    else if (text.includes('보내줘')) {
        resp.output.text = `받는 분의 은행과 계좌번호를 말씀해 주세요.`;
        resp.fallback = true;
    }
    else if (text.includes('은행')){
        resp.output.text = `김손자에게 십만원 보낼게요. 받는 분과 금액을 한 번 더 확인해주세요.
                            인증을 진행할게요. 화면에 얼굴이 보이게 해주세요.`;
        resp.fallback = true;
    }
    else if (text.includes('보냈어요.')){
        resp.output.text = `김손자에게 십만원 보냈어요.`;
        resp.fallback = true;
    }
    else if(text.includes('원하는금액을자유롭게') || text.includes('매월정해진금액')){
        if(work === 'Savings') resp.output.text = '고객님께 적합한 자유적립식 적금 상품을 추천해 드릴게요. 첫번째 또는 화면에 보이는 상품 이름을 말씀해 주세요.';
        resp.fallback = true;
    }
    else if(text.includes('스마트적금') || text.includes('특별한적금') || text.includes('내맘대로적금')){
        if(work === 'Savings') resp.output.text = '스마트적금을 가입하시겠어요? 가입 전 상품설명서를 확인해 주세요.';
        resp.fallback = true;
    }
    else if(text.includes('상담')){
        if(work === 'CallCenter') resp.output.text = '상담 유형을 선택해 주세요. 첫번째 또는 상담 유형을 말씀해 주세요.';
        resp.fallback = true;
    }
    else {
        resp.output.text = `다시 한번 말해주실래요?`;
        resp.fallback = true;
    }

    // SM content cards example
    // if (req.input.text.toLowerCase() == 'show card') {
    //     resp.output.text = 'Here is a cat @showcards(cat)';
    //     resp.variables['public-cat'] = {
    //         'component': 'image',
    //         'data': {
    //             'alt': 'A cute kitten',
    //             'url': 'https://placekitten.com/300/300'
    //         }
    //     };
    // }

    sendMessage(ws, resp);
}

function sendMessage(ws: WebSocket, resp: ConversationResponse) {
    let message: SMmessage = {
        category: 'scene',
        kind: 'request',
        name: 'conversationResponse',
        body: resp
    };

    ws.send(JSON.stringify(message));
}
