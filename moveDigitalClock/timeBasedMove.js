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

function toTwoChars(n){
				return n<10 ? '0'+n : ''+n;
			}