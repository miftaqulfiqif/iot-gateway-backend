import BaseHandler from "./base-handler.js";

export default class DisconnectDeviceBluetooth extends BaseHandler {
    event = "disconnect_bluetooth_device";

    get event() {
        return this.event;
    }

    async handle(socket, data) {
        const {gateway_sn, data: payload} = data;
        const {topic,  } = data.data;

        // send to user
        socket.to(gateway_sn).emit(this.event, data);
        console.log(`Received disconnect_bluetooth_device from ${gateway_sn} : `, data)

        const payloadSend = {
            mac: data.data.payload.mac_address,
            device_function: data.data.payload.device_function,
        }

        console.log(payloadSend);
    }
}