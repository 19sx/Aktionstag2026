from channels.generic.websocket import AsyncWebsocketConsumer


class ChannelConsumer(AsyncWebsocketConsumer):
    groups = ["broadcast"]

    async def connect(self):
        await self.accept()

    async def receive(self, text_data=None, bytes_data=None):
        await self.send(text_data="Hello World!")  # Standardmaessig String
        await self.send(bytes_data=b"Hello World") # b = String to Byte

    async def disconnect(self, close_code):
        print("Verbindung unterbrochen")