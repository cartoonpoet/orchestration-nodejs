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
import {koreanToNumber} from './utils/func'


export function handleMessage(ws: WebSocket, message: any) {
    try {
        const msg: SMmessage = JSON.parse(message);
        if (msg.name == 'conversationRequest') {
            let request: ConversationRequest = msg.body as ConversationRequest;
            handleRequest(ws, request);
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

    // Handle welcome message
    if (req.optionalArgs?.kind == 'init') {
        resp.output.text = '안녕하세요. 무엇을 도와드릴까요?';
    }
    else if (req.input.text.startsWith('이체해')) {
        resp.output.text = '네. 어떤 계좌에서 이체할까요?';
        resp.fallback = true;
    }
    else if (req.input.text.startsWith('계좌조회')) {
        resp.output.text = '네. 계좌조회로 안내해드릴게요.';
        resp.fallback = true;
    }
    else if (req.input.text.startsWith('적금')) {
        resp.output.text = '네. 적금 추천으로 안내해드릴게요.';
        resp.fallback = true;
    }
    else if (req.input.text.startsWith('고객센터')) {
        resp.output.text = '네. 고객센터에 연결해드릴게요.';
        resp.fallback = true;
    }
    else if (req.input.text.includes('번 계좌로 이체해줘')) {
        resp.output.text = '네. 누구에게 보낼까요?';
        resp.fallback = true;
    }
    else if (req.input.text.includes('에게 이체해줘')) {
        resp.output.text = `네. ${req.input.text.replace('에게 이체해줘', '')}계좌로 이체할게요. 얼마를 이체할까요?`;
        resp.fallback = true;
    }
    else if (req.input.text.includes('원 보내')){
        resp.output.text = `네. ${koreanToNumber(req.input.text)}원을 보낼게요. 받는 분과 금액을 한 번 더 확인해주세요.`;
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
