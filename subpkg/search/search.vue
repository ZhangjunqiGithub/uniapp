<template>
	<view>
		<view class="search-box">
			<uni-search-bar @input="input" :radius="100" cancelButton="none"></uni-search-bar>
		</view>
		<uni-swipe-action>
			<block v-for="(item, i) in searchResults" :key="i" >
				<uni-swipe-action-item :right-options="options_r" :left-options="options_l" @click="swipeItemClickHandler($event,item)">
					<view class="sugg-list">
						<view class="sugg-item">
							<view class="people-name">{{item.name}}</view>
							<view class="people-fieldname">{{item.fieldName}}</view>
							<view class="people-field" :style="{color:item.fieldSize == 0 ? '#ff0000' : ''}">{{item.fieldSize}}亩</view>
							<label class="radio" @click="changeState(item)" v-if="type == 0">
								<radio class="#FFC0CB" :checked="item.done === 1 ? true : false"></radio>
							</label>
						</view>
					</view>
				</uni-swipe-action-item>
			</block>
		</uni-swipe-action>
		
<!-- 		<view class="sugg-list">
			<view class="sugg-item" v-for="(item, i) in searchResults" :key="i">
				<view class="people-name">{{item.name}}</view>
				<view class="people-fieldname">{{item.fieldName}}</view>
				<view class="people-field">{{item.fieldSize}}亩</view>
				<label class="radio" @click="changeState(item)">
					<radio class="#FFC0CB" :checked="item.done === 1 ? true : false"></radio>
				</label>
			</view>
		</view> -->
		<text>\n</text>
		<navigator :url="'../add_fieldinfo/add_fieldinfo?name=' + name + '&num=' + searchResults.length" v-if=" kw !== '' && type == 0 && pay == 0"><button type="primary">添加</button></navigator>
		<view class="info" v-if="type == 0 && kw !== '' && pay !== 0">该用户已付款！无法再添加。重新结算后才可添加！</view>
		<text>\n</text>
		<view class="danjia" v-if="searchResults.length !== 0" style="display: flex;">
			<label for="danjia">单价：</label>
			<input type="number" @input="inputHandler" placeholder="请输入单价" id="danjia">
		</view>
		<text>\n</text>
		<view class="zongmushu" v-if="searchResults.length !== 0">
			总亩数：{{allFieldSize}}亩
		</view>
		<text>\n</text>
		<view class="zongqianshu" v-if="searchResults.length !== 0">
			总钱数：<span class="Fee">￥{{allFee}}</span>
		</view>
		<view class="pay" v-if="searchResults.length !== 0 && type == 1" style="display: flex; padding-top: 20px;">
			收的钱：<input type="digit" placeholder="请输入收的钱数" @input="payHandler">
		</view>
		<button type="primary" v-if=" searchResults.length !== 0 && type == 1 && pay == 0" style="margin-top: 50px;" @click="settle">结算</button>
		<button type="default" v-if=" searchResults.length !== 0 && type == 1 && pay !== 0" style="margin-top: 50px; background-color: pink; font-size: 16px;">已付款！应付：{{shouldPay}}元——实付：{{pay}}元</button> 
		<button type="primary" v-if=" searchResults.length !== 0 && type == 1 && pay !== 0" style="margin-top: 10px;" @click="rePay">重新结算</button> 
	</view>
</template>

<script>
	export default {
		data() {
			return {
				timer: null,
				kw: '',
				tempkw: '',
				// 搜索的结果列表
				searchResults: [],
				price: 0,
				allFee: '',
				name: '',
				type: 0,
				shouldPay: 0,
				pay: 0,
				user: {
					name: '',
					fieldName: '',
					fieldSize: '',
					done: ''
				},
				user2: {
					name: '',
					shouldPay: 0,
					pay: 0,
					fieldNumber: 0,
					allArea: 0
				},
				options_l: [{
					text: '修改',
					style: {
						backgroudColor: '#FFC0CB'
					}
				}],
				options_r: [{
					text: '删除',
					style: {
						backgroudColor: '#FFC0CB'
					}
				}]
			};
		},
		onLoad(options) {
			this.type = options.type
		},
		onPullDownRefresh() {
			this.kw = this.tempkw
			this.getSearchList()
			setTimeout(()=> {
				uni.stopPullDownRefresh()
			}, 1000)
		},
		computed: {
			allFieldSize() {
					var sum = 0
					this.searchResults.forEach((item, index) => {
						if(item.done == 1 && item.fieldSize !== 0) {
							sum += item.fieldSize
						}
					})
					sum = sum.toFixed(2)
					this.allFee = (this.price * sum).toFixed(2)
					return sum
			}
		},
		methods: {
			//input输入事件按的处理函数
			input(e) {
				clearTimeout(this.timer)
				this.timer = setTimeout(()=> {
					this.kw = e
					this.tempkw = e
					this.getSearchList()
				},500)
				this.price = 0
				this.allFee = 0
			},
			payHandler(e) {
				clearTimeout(this.timer)
				this.timer = setTimeout(()=> {
					this.user2.pay = e.detail.value
				},500)
			},
			async getSearchList() {
				//判断搜索关键词是否为空
				if(this.kw.length === 0) {
					this.searchResults = []
					return
				}
				if(this.type == 1) {
					this.kw += '/done/1'
				}
				const {data: res} = await uni.$http.get('/fieldinfo/' + this.kw)
				if(!res.flag) {
					this.searchResults = []
					return uni.$showMsg()
				}
				this.searchResults = res.data
				if(this.searchResults.length === 0) {
					this.name = this.kw
				}else {
					this.name = this.searchResults[0].name
				}
				const tempdata = await uni.$http.get('/user/' + this.name)
				if(tempdata.data.data.pay !== 0) {
					this.shouldPay = tempdata.data.data.shouldPay
					this.pay = tempdata.data.data.pay
				}else {
					this.pay = 0
				}
			},
			inputHandler(event) {
				this.price = event.detail.value
				this.allFee = event.detail.value * this.allFieldSize
				this.kw = this.tempkw
				this.getSearchList()
			},
			async changeState(item) {
				if(this.pay == 0) {
					if(item.done == 1) {
						this.user.name = item.name
						this.user.fieldName = item.fieldName
						this.user.fieldSize = item.fieldSize
						this.user.done = 0
						await uni.$http.put('/fieldinfo', this.user)
					}else {
						this.user.name = item.name
						this.user.fieldName = item.fieldName
						this.user.fieldSize = item.fieldSize
						this.user.done = 1
						await uni.$http.put('/fieldinfo', this.user)
					}
					this.getSearchList()
				}else {
					uni.$showMsg('该顾客已付款！')
				}
			},
			async swipeItemClickHandler(e,item) {
				if(this.pay == 0) {
					if(e.position == 'left') {
						uni.navigateTo({
							url: "../modify_fieldinfo/modify_fieldinfo?name="+item.name+"&fieldName="+item.fieldName+"&fieldSize="+item.fieldSize+"&done="+item.done+""
						})
					}else if(e.position == 'right') {
						if(this.type == 0) {
							await uni.$http.delete('/fieldinfo/' + item.name + '/' + item.fieldName)
						}else if(this.type == 1) {
							item.done = 0
							await uni.$http.put('/fieldinfo', item)
						}
						uni.$showMsg('删除成功！')
						this.kw = this.tempkw
						this.getSearchList()
						if(this.searchResults.length === 1) {
							await uni.$http.delete('/user/' + item.name)
						}
					}
				}else {
					uni.$showMsg('该顾客已付款！')
				}
			},
			async settle() {
				let num = 0
				this.searchResults.forEach((item, i) => {
					if(item.fieldSize == 0) {
						num += 1
					}
				})
				if(num == 0) {
					if(this.price == 0){
						uni.$showMsg('未输入单价')
					}else if(this.user2.pay == 0) {
						uni.$showMsg('未输入收的钱数')
					}else {
						this.user2.name = this.name
						this.user2.shouldPay = this.allFee
						this.user2.fieldNumber = this.searchResults.length
						this.user2.allArea = this.allFieldSize
						await uni.$http.put('/user', this.user2)
						uni.$showMsg('结算成功！')
						this.kw = this.tempkw
						this.getSearchList()
					}
				}else {
					uni.$showMsg('还有'+ num +'块田地亩数未知，无法结算！')
				}
				
			},
			async rePay() {
				this.user2.name = this.name
				this.user2.shouldPay = 0
				this.user2.pay = 0
				this.user2.fieldNumber = this.searchResults.length
				this.user2.allArea = this.allFieldSize
				await uni.$http.put('/user', this.user2)
				this.kw = this.tempkw
				this.getSearchList()
			}
		}
	}
</script>

<style lang="scss">
.search-box {
	position: sticky;
	top: 0;
	z-index: 999;
}
.sugg-list {
	padding: 0 5px;
	.sugg-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 12px;
		padding: 13px 0;
		border-bottom: 1px solid #efefef;
		.people-name, .people-fieldname {
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}
}
.Fee {
	text-align: center;
	color: red;
}
.danjia, .zongmushu, .zongqianshu, .pay {
	margin-left: 10px;
}
.info {
	text-align: center;
	background-color: red;
}
</style>
