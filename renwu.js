//存取localstorage中的数据（本地存储）
var store={
	save(key,value){//保存数据
		localStorage.setItem(key,JSON.stringify(value));//调用setItem这个方法（JSON.stringify(value)转换成字符串）
	},
	fetch(key){//获取数据
		return JSON.parse(localStorage.getItem(key)) || [];//数据localStorage.getItem(key)取出来之后由于是字符串所以需要用JSON.parse()解析一波，（获取到的数据会有两种情况  有/空[虽然我设置了不能输空内容，所以空的情况在这是不存在的。但我就是想说]）
	}
};

//var list=[
//	{
//		title:"上天，与太阳肩并肩",
//		time:"创建于 2017/11/03",
//		isChecked:false//不选中
//	},
//	{
//		title:"坐最大的皮皮虾",
//		time:"创建于 2016/08/08",
//		isChecked:true//选中
//	}	
//];


//取出所有localstorage中的值
var list=store.fetch("txz-class");//调用store里fetch这个方法并为其定义一个key值为"txz-class"

		//过滤的三种情况 all finised unfinised(为了之后的‘删除所有’必须从filteredList提取出来作为变量，同时也算是一次优化)
			var filter={
				all:function(list){
					return list;
				},
				finished:function(list){
					return list.filter(function(item){
						return item.isChecked;
					})
				},
				unfinished:function(list){
					return list.filter(function(item){
						return !item.isChecked;
					})
				}
			};
	
var vm=new Vue({
	el:".main",
	data:{
		list:list,
		todo:"",
		enen:"自己定的任务，跪着也要完成哦~",
		edtorTodos:'',//	正在编辑的数据
		beforeTite:'',//记录正在编辑任务的title
		visibility:"all"//通过这个属性值的变化对数据进行筛选
		
	},
	watch:{
		//监控list这个属性，当它发生变化执行这个函数
//		list:function(){	
//			store.save("txz-class",this.list);
//		}
		list:{
			handler:function(){
				store.save("txz-class",this.list);//调用store里的save保存的数据			
			},
			deep:true
			//handler =>  deep:true 深度监控（能监控到对象里面的属性的变化）
		}
	},
	computed:{
		noCheckeLength:function(){//未完成任务的数量
			return this.list.filter(function(item){
				return !item.isChecked
			}).length
		},
		checkeLength:function(){//已成任务的数量
			return this.list.filter(function(item){
				return item.isChecked
			}).length
		},
		allDone: {
          get() {
            // 未完成的数量为0表示全部完成,全部完成返回true
            return this.noCheckeLength === 0;
          },
          set(value) { // value值是checkbox是否选中的值
            this.list.forEach(todo => {
              todo.isChecked = value
            });
          }
        },
		filteredList:function(){
			
			//找到了过滤函数，就返回过滤数据，如果米有就返回所有数据
			return filter[this.visibility]?filter[this.visibility](this.list):list;
//			return filter[this.visibility](this.list);
		}
	},
	methods:{
		addup(ev){
//			添加任务	
				if(this.todo !=""){
					this.list.push({
				 	title:this.todo,     
				 	time:"创建于 "+ new Date().toLocaleDateString(),				 	
				 	isChecked:false//不选中
					 });
					 this.todo=""	
				}else{
					alert("没有输入任务！不能添加空任务。")
				}
					 
		},
		// 清空已完成的任务列表
        ordelete() {
          this.list = filter.unfinished(this.list)//留下没有选中的
        },
//		ordelete(item){
//			list.splice(item);
//		},
		deleteTodo(todo){
			var index=this.list.indexOf(todo);
			this.list.splice(index,1);//splice删除
		},
		detodo(todo){
			//编辑任务,并记录这条任务的title（方便在取消编辑时获取title）
			this.edtorTodos=todo;
			console.log(todo);
			this.beforeTitle=todo.title;	
			
		},
		edtodoed(todo){//编辑任务成功
			this.edtorTodos='';	
		},
		canceltodo(todo){//取消编辑
			todo.title=this.beforeTitle;
			this.beforeTitle='';
			//让div显示，让input消失
			this.edtorTodos='';
		}
	},
	
	directives:{//光标获取焦点
		"focus":{//自定义指令
			update(el,binding){//钩子函数(被绑定模板更新时调用)
				if(binding.value){
					el.focus();//光标定到末尾
				}
			}
		}
	}
});
function watchHashChange(){
	var hash=window.location.hash.slice(1);
	vm.visibility=hash;
}
watchHashChange();

window.addEventListener("hashchange",watchHashChange);



