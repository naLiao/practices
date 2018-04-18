//个位数字按位补0
function toTwo(n){
	return n<10 ? '0'+n : ''+n;
}

//基于时间的运动函数，包括移动、变换透明度，注意参数格式是一个对象
function move(opt){
				//处理传入的数据
				const objInit = {
					ele:null,
					attr:{},
					d:1000,
					sportName:'linear',
					callback:function(){}
				}
				
				//  传入的对象与默认对象合并，有配置用配置，无配置用默认
				opt = Object.assign(objInit,opt);
				
				//计算开始位置begin、需要走的距离count
				const j = {};
				for(let i in opt.attr){
					let b = parseFloat(getComputedStyle(opt.ele)[i]);
					j[i] = {
						b,
						c:opt.attr[i] - b
					}
				}
				let oldTime = Date.now();
				;(function animate(){
					opt.ele.timer = requestAnimationFrame(animate);
					//  获得每一次运行所用的时间，根据时间进行相应的变化
					let t = Date.now() - oldTime;
					let d = opt.d;
					if(t >= d){
						t = d;
					}
					for(i in opt.attr){

						let v = Tween.linear(t, j[i].b, j[i].c, d);
						
						if(i == 'opacity'){
							/*Tween.linear = function (t, b, c, d){  //匀速
										return c*t/d + b;
									}
							*/
							opt.ele.style.opacity = v;
						}else{
							opt.ele.style[i] = v + 'px';
						}
					}
					if(t === d){
						cancelAnimationFrame(opt.ele.timer);
						opt.callback.call(opt.ele);  //用call函数改变this指向
					}
				})();
			}

/*
* 曲线方程
* t : time 已过时间
* b : begin 起始值
* c : count 总的运动值
* d : duration 持续时间
*
* 
*
* http://www.cnblogs.com/bluedream2009/archive/2010/06/19/1760909.html
* */

//各种曲线方程，可以与move函数配合使用
var Tween = {
	linear: function (t, b, c, d){  //匀速
		return c*t/d + b;
	},
	easeIn: function(t, b, c, d){  //加速曲线
		return c*(t/=d)*t + b;
	},
	easeOut: function(t, b, c, d){  //减速曲线
		return -c *(t/=d)*(t-2) + b;
	},
	easeBoth: function(t, b, c, d){  //加速减速曲线
		if ((t/=d/2) < 1) {
			return c/2*t*t + b;
		}
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInStrong: function(t, b, c, d){  //加加速曲线
		return c*(t/=d)*t*t*t + b;
	},
	easeOutStrong: function(t, b, c, d){  //减减速曲线
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeBothStrong: function(t, b, c, d){  //加加速减减速曲线
		if ((t/=d/2) < 1) {
			return c/2*t*t*t*t + b;
		}
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	elasticIn: function(t, b, c, d, a, p){  //正弦衰减曲线（弹动渐入）
		if (t === 0) { 
			return b; 
		}
		if ( (t /= d) == 1 ) {
			return b+c; 
		}
		if (!p) {
			p=d*0.3; 
		}
		if (!a || a < Math.abs(c)) {
			a = c; 
			var s = p/4;
		} else {
			var s = p/(2*Math.PI) * Math.asin (c/a);
		}
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	elasticOut: function(t, b, c, d, a, p){    //正弦增强曲线（弹动渐出）
		if (t === 0) {
			return b;
		}
		if ( (t /= d) == 1 ) {
			return b+c;
		}
		if (!p) {
			p=d*0.3;
		}
		if (!a || a < Math.abs(c)) {
			a = c;
			var s = p / 4;
		} else {
			var s = p/(2*Math.PI) * Math.asin (c/a);
		}
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},    
	elasticBoth: function(t, b, c, d, a, p){
		if (t === 0) {
			return b;
		}
		if ( (t /= d/2) == 2 ) {
			return b+c;
		}
		if (!p) {
			p = d*(0.3*1.5);
		}
		if ( !a || a < Math.abs(c) ) {
			a = c; 
			var s = p/4;
		}
		else {
			var s = p/(2*Math.PI) * Math.asin (c/a);
		}
		if (t < 1) {
			return - 0.5*(a*Math.pow(2,10*(t-=1)) * 
					Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		}
		return a*Math.pow(2,-10*(t-=1)) * 
				Math.sin( (t*d-s)*(2*Math.PI)/p )*0.5 + c + b;
	},
	backIn: function(t, b, c, d, s){     //回退加速（回退渐入）
		if (typeof s == 'undefined') {
		   s = 1.70158;
		}
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	backOut: function(t, b, c, d, s){
		if (typeof s == 'undefined') {
			s = 3.70158;  //回缩的距离
		}
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	}, 
	backBoth: function(t, b, c, d, s){
		if (typeof s == 'undefined') {
			s = 1.70158; 
		}
		if ((t /= d/2 ) < 1) {
			return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		}
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	bounceIn: function(t, b, c, d){    //弹球减振（弹球渐出）
		return c - Tween['bounceOut'](d-t, 0, c, d) + b;
	},       
	bounceOut: function(t, b, c, d){
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
		}
		return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
	},      
	bounceBoth: function(t, b, c, d){
		if (t < d/2) {
			return Tween['bounceIn'](t*2, 0, c, d) * 0.5 + b;
		}
		return Tween['bounceOut'](t*2-d, 0, c, d) * 0.5 + c*0.5 + b;
	}
}

//抖函数
function shake(obj,direction,count=10,time=30,cb){
			let num = 0;
			let init = parseFloat( getComputedStyle(obj)[direction] );
			//创建数组
			const arr = [];
			for(let i=count;i>0;i-=2){
				arr.push(i,-i);
			}
			arr.push(0);
			
			clearInterval(obj.timer);
			obj.timer = setInterval(function(){
				if(num==arr.length) {
					clearInterval(obj.timer);
					cb&&cb();
				}
				obj.style[direction] = arr[num] + init + 'px';
				num++;
			},time)
		}


//随机整数
function random(arr,min,max){
	min = min || Math.min(...arr) || 0;
	max = max || Math.max(...arr) || 0;
	
	return Math.round(Math.random()*(max-min)) + min;
}

//随机小数
function randomFloat(arr,min,max,n){
				min = min || Math.min(...arr) || 0;
				max = max || Math.max(...arr) || 0;
				
				return ((Math.random()*(max-min)) + min).toFixed(n);
			}
