
let Action = {
    GET: 1,
    RUN: 2,
    RESET: 4,
    START: 5,
};

let Device = {
    ULTRASONIC_SENSOR :1,
    LIGHT_SENSOR :3,
    
    JOYSTICK :5,
    SOUND_SENSOR :7,
    LED_OFF :8, //关闭LED 灯
    SEVSEG :9,
    MOTOR :10,   
    SERVO :11, //舵机
    ENCODER :12, //编码电机
    IR :13,
    PIRMOTION :15,
    INFRARED :16,
    LED_RGB :18, // 设置LED 灯 RGB
    LED_COLOR :19, //设置LED 灯颜色
    SHUTTER :20,
    LIMITSWITCH :21,
    BUTTON :22,
    HUMITURE :23,
    GASSENSOR :25,
    COMPASS :26,
    TEMPERATURE_SENSOR_1 :27,
    ANGULAR_SENSOR :28,
    PRESSURE_SENSOR :29,
    DIGITAL :30,
    ANALOG :31,
    SERVO_PIN :33,
    TONE :34,
    PULSEIN :35,
    ULTRASONIC_ARDUINO :36,
    STEPPER :40,
    LEDMATRIX :41, //设置LED 表情
    LEDMATRIX_EMOTION_OFF :42, //关闭表情
    LEDMATRIX_SYMBOL :43, //设置LED符号
    LEDMATRIX_CUST :44, //自定义LED
    LEDMATRIX_OFF :45, //关闭LED
    TIMER :50,
    JOYSTICK_MOVE :52,
    DC_MOTOR : 53, //直流电机
    SMART_SERVO_ANGLE :54, //智能舵机角度
    SMART_SERVO :55, //智能舵机
    DIGITAL_TUBE :56, // 数码管
    DIGITAL_TUBE_CLEAR :57, // 清空数码管
    COMMON_COMMONCMD :60,

    //sensor
    GRAYSCALE_SENSOR_DETECTED_LINE : 201, //单灰度传感器是否检测到线
    GRAYSCALE_SENSOR_GET_VALUE : 202, //获取单灰度传感器数值
    FLAME_SENSOR : 203,  //火焰传感器
    TEMPERATURE_SENSOR :204, //温度传感器
    HUMIDITY_SENSOR :205, //湿度传感器
    VOLUME_SENSOR :206, //声音传感器
    AMBIENT_LIGHT_SENSOR :207, //环境光传感器
    ULTRASONIC_SENSOR :209, //超声传感器
    GAS_PRESSURE_SENSOR :210, //气压超声传感器
    INFRARED_RECEIVER :211, //红外接收器
    INFRARED_SENSOR :212, //红外传感器
    POTENTIONMETER_SENSOR :213, //电位器
    BLUBTOOTH_RECEIVER :214, //蓝牙接收器
    BLUBTOOTH_STICK :215, //蓝牙摇杆
    JOINTED_ARM :217, //摇杆
    TOUCH_BUTTON :218, //触摸开关
    KEY_BUTTON :219, //按键开关
    GYROSCOPE_SENSOR :220, //陀螺仪
    LIMIT_SWITCH :221, //限位开关
    WATER_TEMPERATURE :222, //水温传感器
    ANALOG_INPUT :223, //模拟输入
};

class Commands {

    static littleEndian = false;

    constructor () {
        super();
    }

    genPacket(action, device, args, index = 0){
        let packet = new Uint8Array(7 + args.length);
        packet[0] = 0x77;
        packet[1] = 0x68;
        packet[2] = args.length + 3;
        packet[3] = index;
        packet[4] = action;
        packet[5] = device;

        for (let i = 0; i < args.length; i++) {
            packet[6 + i] = args[i];
        }

        packet[6 + args.length] = 0x0a;

        return packet;
    }

    setInt16(arraybuffer, index, value, littleEndian = true) {
        new DataView(arraybuffer).setInt16(index, value, littleEndian);
    }

    setInt32(arraybuffer, index, value, littleEndian = true) {
        new DataView(arraybuffer).setInt32(index, value, littleEndian);
    }

    /***************************************************
     * 
     * motion
     * 
     ***************************************************/

    set_encoder_motor(motorId, port, power){
        return this.genPacket(Action.RUN, Device.ENCODER,[motorId, port, power]);
    }

    set_dc_motor(motorId, port, power){
        return this.genPacket(Action.RUN, Device.DC_MOTOR,[motorId, port, power]);
    }

    //设置智能舵机角度
    set_smart_servo_angle(Id, speed, angle){
        return this.genPacket(Action.RUN, Device.SMART_SERVO_ANGLE,[Id, speed, angle]);
    }

    //设置智能舵机速度
    set_smart_servo(Id, speed){
        return this.genPacket(Action.RUN, Device.SMART_SERVO,[Id, speed]);
    }

    //设置舵机
    set_servo(Id, port, power){
        return this.genPacket(Action.RUN, Device.SERVO,[Id, port, power]);
    }

    //设置步进电机
    set_step_motor(port, power, step) {

        let args = new Int8Array([port, power, 0, 0]);
        this.setInt16(args, 2, step, Commands.littleEndian);

        return this.genPacket(Action.RUN, Device.STEPPER, args);
    }

    //设置电磁铁
    set_electromagnet(port, status) {
        return this.genPacket(Action.RUN, Device.STEPPER, [port, status]);
    }

    //设置数字输出
    set_digital_output(port, status) {
        return this.genPacket(Action.RUN, Device.DIGITAL, [port, status]);
    }

    /***************************************************
     * 
     * looks
     * 
     ***************************************************/

    //设置情感屏
    set_emotion(Id, portL, portR) {
        return this.genPacket(Action.RUN, Device.LEDMATRIX, [Id, portL, portR]);
    }

    //关闭情感屏
    off_emotion(portL, portR) {
        return this.genPacket(Action.RUN, Device.LEDMATRIX_EMOTION_OFF, [portL, portR]);
    }

    //关闭情感屏 符号
    set_symbol(Id, port) {
        return this.genPacket(Action.RUN, Device.LEDMATRIX_SYMBOL, [Id, port]);
    }

    // 自定义情感屏
    set_symbol_cust(port, dataArray) {
        let args = dataArray.unshift(port);
        return this.genPacket(Action.RUN, Device.LEDMATRIX_CUST, args);
    }

    // 关闭情感屏
    off_led_matrix(port) {
        return this.genPacket(Action.RUN, Device.LEDMATRIX_OFF, [port]);
    }

    // 设置数码管
    set_digital_tube(port, value) {
        return this.genPacket(Action.RUN, Device.DIGITAL_TUBE, [port, value]);
    }

    // 清空数码管
    clear_digital_tube(port) {
        return this.genPacket(Action.RUN, Device.DIGITAL_TUBE_CLEAR, [port]);
    }
    // 设置LED RGB
    set_led_light_rgb(port, R, G, B) {
        return this.genPacket(Action.RUN, Device.LED_RGB, [port, R, G, B]);
    }

    // 设置LED 颜色
    set_led_light_color(port, colorId) {
        return this.genPacket(Action.RUN, Device.LED_COLOR, [port, colorId]);
    }
    // 关闭LED 
    off_led_light(port) {
        return this.genPacket(Action.RUN, Device.LED_OFF, [port]);
    }

    /***************************************************
     * 
     * sensor
     * 
     ***************************************************/
    //单灰度检测到(黑|白)线
    gray_detected_line(port, line_type) {
        return this.genPacket(Action.GET, Device.GRAYSCALE_SENSOR_DETECTED_LINE, [port, line_type]);
    }

    //获取单灰度传感器数值
    gray_value(port) {
        return this.genPacket(Action.GET, Device.GRAYSCALE_SENSOR_GET_VALUE, [port]);
    }

    //获取火焰传感器数值
    flame_value(port) {
        return this.genPacket(Action.GET, Device.FLAME_SENSOR, [port]);
    }

    //获取温度传感器数值
    temperature_value(port) {
        return this.genPacket(Action.GET, Device.TEMPERATURE_SENSOR, [port]);
    }

    //获取湿度传感器数值
    humidity_value(port) {
        return this.genPacket(Action.GET, Device.HUMIDITY_SENSOR, [port]);
    }

    //获取声音传感器数值
    volume_value(port) {
        return this.genPacket(Action.GET, Device.VOLUME_SENSOR, [port]);
    }

    //获取环境光传感器数值
    ambient_light_value(port) {
        return this.genPacket(Action.GET, Device.AMBIENT_LIGHT_SENSOR, [port]);
    }
    //获取超声传感器检测距离
    ultrasonic_detection_distance(port) {
        return this.genPacket(Action.GET, Device.ULTRASONIC_SENSOR, [port]);
    }

    //获取气压传感器数值
    gas_pressure(port) {
        return this.genPacket(Action.GET, Device.GAS_PRESSURE_SENSOR, [port]);
    }
    //红外接收器
    infrared_receiver(port) {
        return this.genPacket(Action.GET, Device.INFRARED_RECEIVER, [port]);
    }
    //红外传感器
    infrared_value(port) {
        return this.genPacket(Action.GET, Device.INFRARED_SENSOR, [port]);
    }
    //电位器
    potentiometer(port) {
        return this.genPacket(Action.GET, Device.POTENTIONMETER_SENSOR, [port]);
    }
    //蓝牙接收器
    bluetooth_receiver(port) {
        return this.genPacket(Action.GET, Device.BLUBTOOTH_RECEIVER, [port]);
    }
    //蓝牙摇杆
    bluetooth_stick(port) {
        return this.genPacket(Action.GET, Device.BLUBTOOTH_STICK, [port]);
    }

    //摇杆
    jointed_arm(port, axis) {
        return this.genPacket(Action.GET, Device.JOINTED_ARM, [port, axis]);
    }

    //触摸开关
    touch_button(port) {
        return this.genPacket(Action.GET, Device.TOUCH_BUTTON, [port]);
    }
    //按键开关
    key_button(port, key) {
        return this.genPacket(Action.GET, Device.KEY_BUTTON, [port, key]);
    }

    //陀螺仪
    gyroscope(port, axis) {
        return this.genPacket(Action.GET, Device.GYROSCOPE_SENSOR, [port, axis]);
    }
    //限位开关
    limit_switch(port) {
        return this.genPacket(Action.GET, Device.LIMIT_SWITCH, [port]);
    }

    //水温传感器
    water_temperature(port) {
        return this.genPacket(Action.GET, Device.WATER_TEMPERATURE, [port]);
    }
    //模拟输入
    analog_input(port) {
        return this.genPacket(Action.GET, Device.ANALOG_INPUT, [port]);
    }
}

export default Commands;


