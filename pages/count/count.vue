<template>
	<view>
		<view class="tip">
			数据不能及时更新，请下拉刷新两次更新数据
		</view>
		<view class="yes">已付款</view>
		<view class="sugg-list">
			<view class="sugg-item" v-for="(item, i) in searchResults" :key="i" v-if="item.pay !== 0">
				<view class="people-name">{{item.name}}</view>
				<view class="people-shouldPay">应付：{{item.shouldPay}}元</view>
				<view class="people-pay">实付：{{item.pay}}元</view>
				<view class="people-fieldNumber">田地数：{{item.fieldNumber}}块</view>
				<view class="people-allArea">总亩数：{{item.allArea}}亩</view>
			</view>
		</view>
		<view class="no">未付款</view>
		<view class="sugg-list">
			<view class="sugg-item" v-for="(item, i) in searchResults" :key="i" v-if="item.pay == 0 && item.allArea != 0">
				<view class="people-name">{{item.name}}</view>
				<view class="people-shouldPay">应付：{{item.shouldPay}}元</view>
				<view class="people-pay">实付：{{item.pay}}元</view>
				<view class="people-fieldNumber">田地数：{{item.fieldNumber}}块</view>
				<view class="people-allArea">总亩数：{{item.allArea}}亩</view>
			</view>
		</view>
		<view class="finall">总结</view>
		<view class="detail">
			<view class="allshouldpay">总应收：{{allShouldPay}}元</view>
			<view class="allpay">总实收：{{allPay}}元</view>
			<view class="allfieldnumber">总田地数：{{allFieldNumber}}块</view>
			<view class="allarea">总亩数：{{allArea}}亩</view>
		</view>
		<button type="primary" class="reset" @click="resetAll">重置账本</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				searchResults: [],
				allShouldPay: 0,
				allPay: 0,
				allFieldNumber: 0,
				allArea: 0,
				user: {
					name: '',
					shouldPay: 0,
					pay: 0,
					fieldNumber: 0,
					allArea: 0
				}
			};
		},
		onLoad() {
			this.getSearchList()
			this.reset()
		},
		onPullDownRefresh() {
			this.getSearchList()
			this.reset()
			setTimeout(()=> {
				uni.stopPullDownRefresh()
			}, 1000)
		},
		methods: {
			async handle(tempuser) {
				const {data: res} = await uni.$http.get('/fieldinfo/' + tempuser.name + '/done/1')
				this.user.name = tempuser.name
				let sum = 0
				res.data.forEach((item, i) => {
					sum += item.fieldSize
				})
				this.user.allArea = sum.toFixed(2)
				this.user.fieldNumber = res.data.length
				this.user.shouldPay = tempuser.shouldPay
				this.user.pay = tempuser.pay
				await uni.$http.put('/user', this.user)
			},
			async getSearchList() {
				const {data: res} = await uni.$http.get('/user')
				if(!res.flag) return uni.$showMsg()
				res.data.forEach((item1, i) => {
					this.handle(item1)
				})
				this.searchResults = res.data
				let tempsum = 0
				this.searchResults.forEach((item2, i) => {
					this.allShouldPay += item2.shouldPay
					this.allPay += item2.pay
					this.allFieldNumber += item2.fieldNumber
					tempsum += item2.allArea
				})
				this.allArea = tempsum.toFixed(2)
			},
			reset() {
				this.allShouldPay = 0
				this.allPay = 0
				this.allFieldNumber = 0
				this.allArea = 0
			},
			 resetAll() {
				uni.showModal({
					title: '提示',
					content: '确定重置账本吗？',
					cancelText: "取消", // 取消按钮的文字  
					confirmText: "确认", // 确认按钮的文字  
					showCancel: true, // 是否显示取消按钮，默认为 true
					confirmColor: '#f55850',
					cancelColor: '#39B54A',
					success: (res) => {
						if(res.confirm) {  
							console.log('comfirm') //点击确定之后执行的代码
							uni.$http.put('/fieldinfo/all')
							uni.$http.put('/user/all')
							this.getSearchList()
							this.reset()
						}
					} 
				})
			}
		}
	}
</script>

<style lang="scss">
.tip {
	text-align: center;
	color: red;
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
		.people-name, .people-shouldPay, .people-pay {
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		.people-shouldPay {
			color: darkorchid;
		}
		.people-pay {
			color: forestgreen;
		}
	}
}
.yes, .no, .finall {
	width: 100%;
	height: 20px;
	text-align: center;
	justify-content: space-between;
}
.yes {
	background-color: limegreen;
}
.no {
	background-color: red;
	margin-top: 20px;
}
.finall {
	background-color: #ffaaff;
	margin-top: 40px;
}
.detail {
	text-align: center;
}
.allshouldpay, .allpay, .allfieldnumber, .allarea {
	margin-top: 30px;
	font-size: 25px
}
.reset {
	margin-top: 40px;
}
</style>
