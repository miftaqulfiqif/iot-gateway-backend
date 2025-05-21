import BaseHandler from "./base-handler.js";
import { mqttClient } from "../../../applications/app.js";
import { calculateHealthMetrics } from "../../../generated/calculate-healt-metrics.js";

export default class StartBMI extends BaseHandler {
  event = "start_bmi";
  get event() {
    return this.event;
  }

  handle(socket, data) {
    const { user_id, data: payload } = data;

    socket.to(user_id).emit(this.event, data);
    console.log(`Received start bmi from ${user_id}:`, payload);

    const dataPatient = data.data.patient;

    const data_bmi = [
      {
        height: 172,
        age: 23,
        gender: "male",
        bmiWeight: 87,
        impedance: 600,
      },
    ];

    const result = calculateHealthMetrics(data_bmi[0]);

    console.log("RESULT : ", result);

    // mqttClient.publish(payload.topic, payload.payload, (err) => {
    //   if (err) {
    //     console.log("❌ MQTT publish error:", err);
    //   } else {
    //     console.log(`✅ MQTT message published to ${payload.topic}`);
    //     console.log(
    //       `Received start bmi from ${user_id}: payload : `,
    //       payload.payload
    //     );

    //     mqttClient.publish(
    //       "ble/start_bmi/patient",
    //       JSON.stringify(dataPatient),
    //       (err) => {
    //         if (err) {
    //           console.log("❌ MQTT publish error:", err);
    //         } else {
    //           console.log(`✅ MQTT message published to ble/start_bmi/patient`);
    //           console.log(
    //             `Received start bmi from ${user_id}: patient : `,
    //             dataPatient
    //           );
    //         }
    //       }
    //     );
    //   }
    // });
  }
}
