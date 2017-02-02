const WINDOW_WIDTH = document.body.clientWidth;
const WINDOW_HEIGHT = 500;
const RADIUS = 7;

const SEPARTE = RADIUS * 2 + 10;

const MARGIN_TOP = 30;
// 在视口居中，视口宽度减去字符占据的宽度除以2
const MARGIN_LEFT = (WINDOW_WIDTH - (((2 * RADIUS) * 7 + SEPARTE) * 6 + ((2 * RADIUS) * 4 + SEPARTE) * 2)) / 2;

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
canvas.width = WINDOW_WIDTH;
canvas.height = WINDOW_HEIGHT;

var balls = [];
const colors = ["#33B5E5", "#0099CC", "#AA66CC", "#9933CC", "#99CC00", "#669900", "#FFBB33", "#FF8800", "#FF4444", "#CC0000"];

function drawArrow() {
    context.moveTo(WINDOW_WIDTH / 2 - 10, 300);
    context.lineTo(WINDOW_WIDTH / 2 - 10, 450);
    context.lineTo(WINDOW_WIDTH / 2 - 25, 450);
    context.lineTo(WINDOW_WIDTH / 2, 470);
    context.lineTo(WINDOW_WIDTH / 2 + 25, 450);
    context.lineTo(WINDOW_WIDTH / 2 + 10, 450);
    context.lineTo(WINDOW_WIDTH / 2 + 10, 300);
    context.closePath();

    /* 指定渐变区域 */
    var grad = context.createLinearGradient(WINDOW_WIDTH / 2 - 100, 300, WINDOW_WIDTH / 2, 470);
    /* 指定几个颜色 */
    grad.addColorStop(0, 'rgb(255, 255, 255)');
    grad.addColorStop(1, 'rgb(0, 122, 204)');
    /* 将这个渐变设置为fillStyle */
    context.fillStyle = grad;
    //contetx.fillStyle = 'RGB(0,122,204)'
    context.fill();

    context.strokeStyle = 'transparent';
    context.stroke();
}

function drawTopic(ctx) {
    ctx.font = "30px 微软雅黑";
    // Create gradient
    var gradient = ctx.createLinearGradient(0, 0, 200, 0);
    gradient.addColorStop("0", "magenta");
    gradient.addColorStop("0.5", "blue");
    gradient.addColorStop("1.0", "red");
    // Fill with gradient
    ctx.fillStyle = gradient;
    ctx.fillText("Timer-计时器", 70, 100);
}

//绘制程序说明和箭头
drawArrow();
drawTopic(context);

document.getElementById('start').addEventListener('click', function () {
    // 清除右边打印的计时数字
    //context.clearRect(MARGIN_LEFT + ((2 * RADIUS) * 7 + SEPARTE) * 6 + ((2 * RADIUS) * 4 + SEPARTE) * 2, 0, WINDOW_WIDTH, WINDOW_HEIGHT);

    var time = {
        hours: 0,
        minutes: 0,
        seconds: 0,
        // counts控制计时
        // setInterval 50ms 执行一次，counts++到20时，执行一次计时程序
        counts: 0
    };

    var cp_time = {};
    var interval = setInterval(function () {
        // 深拷贝time对象，用来检查哪个部分的值变了
        // 直接赋值是浅拷贝，只传递引用
        for (var i in time) {
            if (time.hasOwnProperty(i)) {
                cp_time[i] = time[i];
            }
        }
        renderMilliSeconds(context);
        render(context, time);
        update(time, cp_time);
    }, 50);

    // 开始计时后禁止start按钮
    document.getElementById('start').setAttribute('disabled', 'disabled');


    function addBtn(btn_text, btn_attribute) {
        var btn = document.createElement('button');
        btn.appendChild(document.createTextNode(btn_text));
        document.getElementsByClassName('control')[0].appendChild(btn);
        btn.setAttribute('id', btn_attribute);
    }
    // 添加计时按钮
    addBtn('计时', 'prt');
    // 添加停止计时按钮
    addBtn('停止计时', 'stop');


    // 打印计时按钮触发的时间快照

    //(canvas绘制到时钟右侧)
    //var font_lh = 0,
    //    col = 0;
    //document.getElementById('prt').addEventListener('click', function () {
    //    if (col === 0) {
    //        if (font_lh <= WINDOW_HEIGHT) {
    //            context.fillText(time.hours + ':' + time.minutes + ':' + time.seconds, MARGIN_LEFT + ((2 * RADIUS) * 7 + SEPARTE) * 6 + ((2 * RADIUS) * 4 + SEPARTE) * 2, font_lh += 20);
    //        } else {
    //            col = 1;
    //            font_lh = 0;
    //        }
    //    } else if (col === 1) {
    //        if (font_lh <= WINDOW_HEIGHT) {
    //            context.fillText(time.hours + ':' + time.minutes + ':' + time.seconds, MARGIN_LEFT + ((2 * RADIUS) * 7 + SEPARTE) * 6 + ((2 * RADIUS) * 4 + SEPARTE) * 3, font_lh += 20);
    //        } else {
    //            col = 2;
    //            font_lh = 0;
    //        }
    //    } else if (col === 2) {
    //        if (font_lh <= WINDOW_HEIGHT) {
    //            context.fillText(time.hours + ':' + time.minutes + ':' + time.seconds, MARGIN_LEFT + ((2 * RADIUS) * 7 + SEPARTE) * 6 + ((2 * RADIUS) * 4 + SEPARTE) * 4, font_lh += 20);
    //        } else {
    //            col = 3;
    //            font_lh = 0;
    //        }
    //    } else if (col === 3) {
    //        if (font_lh <= WINDOW_HEIGHT) {
    //            context.fillText(time.hours + ':' + time.minutes + ':' + time.seconds, MARGIN_LEFT + ((2 * RADIUS) * 7 + SEPARTE) * 6 + ((2 * RADIUS) * 4 + SEPARTE) * 5, font_lh += 20);
    //        }
    //    }
    //}, false);

    // js写入到屏幕下方
    var ul_wrap = document.getElementsByClassName('time-prt')[0];
    document.getElementById('prt').addEventListener('click', function myfunction() {
        var li = document.createElement('li');
        //防止出现毫秒数为1000的情况, 所以，如果出现x:x:x:0的情况，为if；如果是x:x:x只有三位，为else
        if (mSeconds !== 1000) {
            li.appendChild(document.createTextNode(time.hours + ':' + time.minutes + ':' + time.seconds + ':' + mSeconds));
        } else {
            li.appendChild(document.createTextNode(time.hours + ':' + time.minutes + ':' + time.seconds));
        }
        ul_wrap.appendChild(li);
    }, false);

    document.getElementById('stop').addEventListener('click', function () {
        clearInterval(interval);
        document.getElementById('start').removeAttribute('disabled');
        var control = document.getElementsByClassName('control')[0];
        control.removeChild(document.getElementById('prt'));
        control.removeChild(document.getElementById('stop'));
        // 恢复数字到初始值
        render(context, time = {
            hours: 0,
            minutes: 0,
            seconds: 0,
            counts: 0
        });
        //恢复毫秒
        context.clearRect(MARGIN_LEFT + ((2 * RADIUS) * 7 + SEPARTE) * 6 + ((2 * RADIUS) * 4 + SEPARTE) * 2, 0, WINDOW_WIDTH, WINDOW_HEIGHT);
        context.fillText(0, MARGIN_LEFT + ((2 * RADIUS) * 7 + SEPARTE) * 6 + ((2 * RADIUS) * 4 + SEPARTE) * 2, 200);
        mSeconds = 0;

        //下方计时区域添加间隔
        var li_pause = document.createElement('li');
        li_pause.setAttribute('class', 'pause');
        li_pause.appendChild(document.createTextNode('pause'));
        ul_wrap.appendChild(li_pause);
    });

    // 开始按钮结束
}, false);

//模仿毫秒
var mSeconds = 0;
function renderMilliSeconds(ctx) {
    if (mSeconds < 1000) {
        ctx.clearRect(MARGIN_LEFT + ((2 * RADIUS) * 7 + SEPARTE) * 6 + ((2 * RADIUS) * 4 + SEPARTE) * 2, 0, WINDOW_WIDTH, WINDOW_HEIGHT);
        ctx.fillText(mSeconds, MARGIN_LEFT + ((2 * RADIUS) * 7 + SEPARTE) * 6 + ((2 * RADIUS) * 4 + SEPARTE) * 2, 200);
        // 循环任务50毫秒执行一次
        mSeconds += 50;
    } else {
        mSeconds = 0;
    }
}

function update(time, cp_time) {
    // Don't use with
    time.counts++;
    if (time.counts === 20) {
        time.counts = 0;
        if (time.hours < 100) {
            time.seconds++;
            if (time.seconds > 59) {
                time.seconds = 0;
                time.minutes++;
                // minutes加完后再比较，否则seconds置0，minutes为60
                if (time.minutes > 59) {
                    time.seconds = time.minutes = 0;
                    time.hours++;
                }
            }
            // 检查哪个值变了
            for (var i in time) {
                if (time.hasOwnProperty(i)) {
                    if (parseInt(cp_time.seconds % 10) !== parseInt(time.seconds % 10)) {
                        addBalls(MARGIN_LEFT + ((2 * RADIUS) * 7 + SEPARTE) * 5 + ((2 * RADIUS) * 4 + SEPARTE) * 2, MARGIN_TOP, parseInt(time.seconds % 10));
                    }
                    if (parseInt(cp_time.seconds / 10) !== parseInt(time.seconds / 10)) {
                        addBalls(MARGIN_LEFT + ((2 * RADIUS) * 7 + SEPARTE) * 4 + ((2 * RADIUS) * 4 + SEPARTE) * 2, MARGIN_TOP, parseInt(time.seconds / 10));
                    }
                    if (parseInt(cp_time.minutes % 10) !== parseInt(time.minutes % 10)) {
                        addBalls(MARGIN_LEFT + ((2 * RADIUS) * 7 + SEPARTE) * 3 + (2 * RADIUS) * 4 + SEPARTE, MARGIN_TOP, parseInt(time.minutes % 10));
                    }
                    if (parseInt(cp_time.minutes / 10) !== parseInt(time.minutes / 10)) {
                        addBalls(MARGIN_LEFT + ((2 * RADIUS) * 7 + SEPARTE) * 2 + (2 * RADIUS) * 4 + SEPARTE, MARGIN_TOP, parseInt(time.minutes / 10));
                    }
                    if (parseInt(cp_time.hours % 10) !== parseInt(time.hours % 10)) {
                        addBalls(MARGIN_LEFT + (2 * RADIUS) * 7 + SEPARTE, MARGIN_TOP, parseInt(time.hours % 10));
                    }
                    if (parseInt(cp_time.hours / 10) !== parseInt(time.hours / 10)) {
                        addBalls(MARGIN_LEFT, MARGIN_TOP, parseInt(time.hours / 10));
                    }
                }
            }
        } else {
            time.hours = 99;
            time.minutes = 59;
            time.seconds = 59;
            alert('你四天四夜没合眼吗？');
        }
    }
    updateBalls();

    var cnt = 0;
    for (var j = 0; j < balls.length; j++) {

        if (balls[j].x + RADIUS > 0) {
            balls[cnt++] = balls[j];
        }
    }
    while (balls.length > cnt) {
        balls.pop();
    }

    // console.log(balls.length, cnt);
}

function addBalls(x, y, num) {
    for (var i = 0; i < digit[num].length; i++) {
        for (var j = 0; j < digit[num][i].length; j++) {
            if (digit[num][i][j] === 1) {
                var aBall = {
                    x: x + j * 2 * (RADIUS + 1) + (RADIUS + 1),
                    y: y + i * 2 * (RADIUS + 1) + (RADIUS + 1),
                    g: 1.5 + Math.random(),
                    // vx: -parseInt(Math.random() * 10),
                    // Math.floor(min+Math.random()*(max-min));
                    vx: -Math.floor(2 + Math.random() * (10 - 2)),
                    vy: -7,
                    color: colors[Math.floor(Math.random() * colors.length)]
                };
                balls.push(aBall);
            }
        }
    }
}

function updateBalls() {
    for (var i = 0; i < balls.length; i++) {
        balls[i].x += balls[i].vx;
        balls[i].y += balls[i].vy;
        balls[i].vy += balls[i].g;

        if (balls[i].y >= WINDOW_HEIGHT - RADIUS) {
            balls[i].y = WINDOW_HEIGHT - RADIUS;
            balls[i].vy = -balls[i].vy * 0.75;
        }
    }
}

function render(ctx, time) {
    ctx.clearRect(0, 0, MARGIN_LEFT + ((2 * RADIUS) * 7 + SEPARTE) * 6 + ((2 * RADIUS) * 4 + SEPARTE) * 2, WINDOW_HEIGHT);
    counts = 0;
    var hours = time.hours;
    var minutes = time.minutes;
    var seconds = time.seconds;
    renderDigit(MARGIN_LEFT, MARGIN_TOP, parseInt(hours / 10), ctx);
    // 2*RADIUS*7为前一个数字的字宽，代表每一个数字的字位为7位
    renderDigit(MARGIN_LEFT + (2 * RADIUS) * 7 + SEPARTE, MARGIN_TOP, parseInt(hours % 10), ctx);
    // 冒号
    renderDigit(MARGIN_LEFT + ((2 * RADIUS) * 7 + SEPARTE) * 2, MARGIN_TOP, 10, ctx);
    // 乘以4的部分为冒号的间隔
    renderDigit(MARGIN_LEFT + ((2 * RADIUS) * 7 + SEPARTE) * 2 + (2 * RADIUS) * 4 + SEPARTE, MARGIN_TOP, parseInt(minutes / 10), ctx);

    renderDigit(MARGIN_LEFT + ((2 * RADIUS) * 7 + SEPARTE) * 3 + (2 * RADIUS) * 4 + SEPARTE, MARGIN_TOP, parseInt(minutes % 10), ctx);
    //两个冒号了
    renderDigit(MARGIN_LEFT + ((2 * RADIUS) * 7 + SEPARTE) * 4 + (2 * RADIUS) * 4 + SEPARTE, MARGIN_TOP, 10, ctx);

    renderDigit(MARGIN_LEFT + ((2 * RADIUS) * 7 + SEPARTE) * 4 + ((2 * RADIUS) * 4 + SEPARTE) * 2, MARGIN_TOP, parseInt(seconds / 10), ctx);

    renderDigit(MARGIN_LEFT + ((2 * RADIUS) * 7 + SEPARTE) * 5 + ((2 * RADIUS) * 4 + SEPARTE) * 2, MARGIN_TOP, parseInt(seconds % 10), ctx);

    // 绘制小球
    for (var j = 0; j < balls.length; j++) {
        ctx.fillStyle = balls[j].color;
        ctx.beginPath();
        ctx.arc(balls[j].x, balls[j].y, RADIUS, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
}

function renderDigit(x, y, num, ctx) {
    ctx.fillStyle = 'rgb(0%, 38.2%, 69.5%)';
    for (var i = 0; i < digit[num].length; i++) {
        for (var j = 0; j < digit[num][i].length; j++) {
            if (digit[num][i][j] === 1) {
                ctx.beginPath();
                ctx.arc(x + j * 2 * (RADIUS + 1) + (RADIUS + 1), y + i * 2 * (RADIUS + 1) + (RADIUS + 1), RADIUS, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
            }
        }
    }
}