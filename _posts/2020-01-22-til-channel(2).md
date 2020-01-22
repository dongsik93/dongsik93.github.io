---
layout: post
title: "Channels를 이용한 실시간 채팅 구현 - 튜토리얼 (2)"
subtitle: "django channel tutorial"
date: 2020-01-22 18:00:00 +0900
categories: til
tags: django channel websocket
comments: true
---

# Channels를 이용한 실시간 채팅 구현 - 튜토리얼 (2)

> 이전 포스팅에 이어서 튜토리얼 2



### 1. Room View 추가하기

- 채팅방 화면인 room.html을 만든다

```html
<!-- chat/templates/chat/room.html -->
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8"/>
    <title>Chat Room</title>
</head>
<body>
    <textarea id="chat-log" cols="100" rows="20"></textarea><br/>
    <input id="chat-message-input" type="text" size="100"/><br/>
    <input id="chat-message-submit" type="button" value="Send"/>
</body>
<script>
    var roomName = "{{ room_name|escapejs }}";

    var chatSocket = new WebSocket(
        'ws://' + window.location.host +
        '/ws/chat/' + roomName + '/');

    chatSocket.onmessage = function(e) {
        var data = JSON.parse(e.data);
        var message = data['message'];
        document.querySelector('#chat-log').value += (message + '\n');
    };

    chatSocket.onclose = function(e) {
        console.error('Chat socket closed unexpectedly');
    };

    document.querySelector('#chat-message-input').focus();
    document.querySelector('#chat-message-input').onkeyup = function(e) {
        if (e.keyCode === 13) {  // enter, return
            document.querySelector('#chat-message-submit').click();
        }
    };

    document.querySelector('#chat-message-submit').onclick = function(e) {
        var messageInputDom = document.querySelector('#chat-message-input');
        var message = messageInputDom.value;
        chatSocket.send(JSON.stringify({
            'message': message
        }));

        messageInputDom.value = '';
    };
</script>
</html>
```

- 채팅방을 만들었으니 이제 View에 추가해준다

```python
# chat/views.py
from django.shortcuts import render

def index(request):
    return render(request, 'index.html', {})

def room(request, room_name):
    return render(request, 'room.html', {
        'room_name': room_name
    })
```

- 다음으로 URL 매핑을 해준다

```python
# chat/urls.py
from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('<str:room_name>/', views.room, name='room'),
]
```

### 2. 테스트 해보기

- 서버를 실행하고 `http://127.0.0.1:8000/chat/ `에 접속해보자

- `lobby`를 입력하고 enter를 치게되면 아래와 같이 채팅방 화면이 나오게 된다

![chat(2)_1](/img/in-post/chat(2)/chat(2)_1.png)

- 여기서 메세지를 send해보면 동작하지 않는데, 이유는 room view가 웹 소켓 URL인 ws://127.0.0.1:8000/ws/chat/lobby/ 를 open 하려고 하는데 아직 웹 소켓 소비자를 만들지 않았기 때문에 오류가 나게된다



### 3. 첫 번째 소비자 작성

- Django가 HTTP 요청을 받아들이면, URL conf를 찾아서 요청을 처리하기 위한 View 함수를 실행하는 것 처럼, Channels 가 WebSocket 연결을 받아들이면, `root routing configurations`에서 소비자를 찾은 후에 이벤를 처리하기 위한 함수들을 호출한다
- `/ws/chat/ROOM_NAME/` 의 경로로 연결된 WebSocket을 받아들이는 소비자를 작성해본다

> 경로 URL에 /ws/가 있는데, 이는 HTTP 요청과 WebSocket을 구분짓기 위한 방법이다. Nginx같은 웹 서버의 배포모드에서 /ws/로 HTTP 요청은 uWSGI로 처리를 하고, WebSocket 요청은 ASGI로 처리를 한다
>
> 
>
> **uWSGI란?**
>
> WSGI 스펙에 정의된 방법을 사용하여 python 애플리케이션과 통신하고, 프로토콜을 통해 다른 웹 서버와 통신하게 해주는 애플리케이션 서버 컨테이너라고 한다
>
> 
>
> **ASGI란?**
>
> WSGI를 계승해 비동기 방식으로 실행되며, Django Channels와 배포에 사용되는 Daphne 서버에서 정의한 사양이다

- 소비자 구현을 위해 `consumers.py`를 만든다

```python
# chat/consumers.py
from channels.generic.websocket import WebsocketConsumer
import json

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        self.send(text_data=json.dumps({
            'message': message
        }))
```

- `consumer.py`는 모든 요청을 받아들이는 비동기적인 WebSocket 소비자 역할을 하게된다. 즉 메세지를 클라이언트로부터 받아서 그대로 클라이언트에게 전달하는 기능을 하게 된다

### 4. routing 작성

- routing configuration 파일생성을 위해 `routing.py`를 작성한다

```python
# chat/routing.py
from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/chat/(?P<room_name>\w+)/$', consumers.ChatConsumer),
]
```

- 위에서 만든 routing 파일을 Django가 인식 할 수 있도록 추가해준다

```python
# mysite/routing.py
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
import chat.routing

application = ProtocolTypeRouter({
    # (http->django views is added by default)
    'websocket': AuthMiddlewareStack(
        URLRouter(
            chat.routing.websocket_urlpatterns
        )
    ),
})
```

- root routing configuration 파일, 즉 `mysite/routing.py`는 클라이언트와 Channels 개발 서버와 연결이 맺어질 때, `ProtocolTypeRouter`를 가장 먼저 탐색해서 어떤 타입의 연결인지 구분한다
  - **WebSocket** 연결이면, 이 연결은 AuthMiddlewareStack으로 이어진다
  - `AuthMiddlewareStack`은 현재 인증된 사용자에 대한 참조로 scope를 결정한다. 이는 Django에서 현재 인증된 사용자의 View 함수에서 request 요청을 결정하는 **AuthenticationMiddleware**와 유사한 방식으로, 그 결과 URL Router로 연결된다
- `URLRouter`는 작선한 url 패턴을 기반으로 특정 소비자의 라우트 연결 HTTP path를 탐색한다

### 5. 테스트

- 이제 소비자를 작성했으므로 /ws/chat/ROOM_NAME 경로를 잘 처리하는지 확인한다

- 서버를 동작시키기 전에 migrate를 해준다

![chat(2)_2](/img/in-post/chat(2)/chat(2)_2.png)

- 테스트 결과 이제 입력하면 채팅방에 채팅이 올라온다. 하지만 같은 채널에 존재하는 다른 사용자는 메세지를 볼 수 없기 때문에 이를 해결해 준다

### 6. Channel layer

- 이제 같은 채팅방의 다른 클라이언트들에게 메세지를 전송하기 위해 Channel layer 를 구현한다
- `Channel layer`는 의사소통 시스템으로 다음와 같은 추상화를 제공한다
  - channel
    - 메세지를 보낼 수 있는 우편함 개념이다
    - 각 채널은 이름을 갖고 있으며, 누구든지 채널에 메세지를 보낼 수 있다
  - group
    - 채널과 관련된 그룹이다
    - 그룹은 이름을 가지고, 그룹 이름을 가진 사용자는 누구나 그룹에 채널을 추가/삭제가 가능하고, 그룹의 모든 채널에서 메세지를 보낼 수 있다
    - 하지만 그룹에 속한 채널을 나열할 수는 없다
- 모든 소비자들은 채널 이름을 자동으로 생성 받으며, Channel layer를 통해 의사소통을 할 수 있다

- Channel layer 구현을 위해 `Redis`를 사용한다

```shell
brew install redis
```

- Redis를 설치하고 Channels가 Redis 인터페이스를 알 수 있도록 패키지를 설치해야 한다

```shell
pip install channels_redis
```

- 설치 후 setting.py를 수정한다

```python
# mysite/setting.py
ASGI_APPLICATION = 'mysite.routing.application'
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [('127.0.0.1', 6379)],
        },
    },
}
```

- 설정을 해주고 channel layer와 Redis의 연결을 확인한다
- Redis 서버를 켜준다

```shell
brew services start redis
```

- python shell을 켜준다

```python
python manage.py shell
>>> import channels.layers

>>> channel_layer = channels.layers.get_channel_layer()

>>> from asgiref.sync import async_to_sync

>>> async_to_sync(channel_layer.send)('test_channel', {'type': 'hello'})

>>> async_to_sync(channel_layer.receive)('test_channel')
```

- 아래 사진처럼 `{'type' : 'hello'}`가 출력되면 테스트 성공

![chat(2)_3](/img/in-post/chat(2)/chat(2)_3.png)

- 이제 consumers.py를 수정해준다

```python
# chat/consumers.py
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
import json

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    # Receive message from room group
    def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'message': message
        }))
```

- 클라이언트가 메세지를 등록하면, JS 함수가 WebSocket을 통해 소비자에게 메세지를 전송한다. 소비자가 메세지를 받고, room 이름에 대응되는 그룹으로 forward 하게된다. 따라서 같은 그룹에 있는 모든 소비자는 메세지를 받을 수 있게 된다
- `self.scope['url_route']['kwargs']['room_name']`
  - chat/routing.py에 정의된 URL 파라미터에서 room_name을 얻는다
  - 즉 소비자에게 WebSocket 연결을 열어준다
  - 모든 소비자들은 현재 인증된 유저, URL의 인자를 포함하여 연결에 대한 정보를 갖는 scope를 갖는다

- `self.room_group_name = 'chat_%s' % self.room_name` 
  - 사용자가 작성한 room 이름으로부터 채널의 그룹 이름을 짓는다
- `async_tosync(self.channel_layer.group_add)(...)`
  - 그룹에 join한다
  - 소비자들은 비동기 Channel layer 메서드를 호출할 때 동기적으로 받아야 하기 때문에, async_to_sync(...)같은 wrapper가 필요하다
- `self.accept()`
  - WebSocket 연결을 받아들인다
- `async_to_sync(self.channel_layer.group_discard)(...)`
  - 그룹을 나간다
- `async_to_sync(self.channel_layer.group_send)`
  - 그룹에게 이벤트를 전송한다
  - 이벤트에는 이벤트를 수신하는 소비자가 호출해야 하는 메서드 이름에 대응하는 특별한 type 키가 있다

### 7. 테스트

- 이제 브라우저를 2개 켜서 서로 메세지 전송이 가능한지를 테스트 해보자

- 같은 room_name으로 접속했을 때 메세지가 공유되고, 다른 roon_name이라면 의사소통이 되지 않는다

![chat(2)_4](/img/in-post/chat(2)/chat(2)_4.png)



참고사이트

- [Django channel Tutorial Part 2](https://channels.readthedocs.io/en/latest/tutorial/part_2.html){: class="underlineFill"} 

