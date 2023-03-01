<template>
	<view>
		<form>
			<view class="name" style="display: flex;">
				<label for="name">姓名：{{user.name}}</label>
			</view>
			
			<view class="field-name" style="display: flex;">
				<label for="field-name">田地名：</label>
				<view class="father-name">
					<input type="text" placeholder="请输入田地名" id="field-name" class="son-name" @input="inputName">	
				</view>
			</view>
			
			<view class="field-size" style="display: flex;">
				<label for="field-size">亩数：</label>
				<view class="father-mushu">
					<input type="digit" placeholder="请输入亩数(未知可以先不输入)" id="field-size" class="son-mushu" @input="inputFieldSize">
				</view>
			</view>

		    <view class="btn-area">
				<button style="margin: 30rpx 0" type="primary" @click="submitForm">添加</button>
				<button style="margin: 30rpx 0" formType="reset">取消</button>
		    </view>
		</form>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				num: 0,
				user: {
					name: '',
					fieldName: '',
					fieldSize: 0,
					done: 1
				},
				user2: {
					name: '',
					shouldPay: 0,
					pay: 0,
					fieldNumber: 0,
					allArea: 0
				}
			};
		},
		onLoad(options) {
			this.user.name = options.name
			this.user2.name = options.name
			this.num = options.num
		},
		methods: {
			inputName(e) {
				this.user.fieldName = e.detail.value
			},
			
			inputFieldSize(e) {
				this.user.fieldSize = e.detail.value
			},
			
			async submitForm(e) {
				const {data: res} = await uni.$http.post('/fieldinfo', this.user)
				if(!res.flag) return uni.$showMsg()
				else {
					this.user.fieldName = ''
					this.user.fieldSize = 0
					uni.$showMsg("添加成功！")
					if(this.num == 0) {
						await uni.$http.post('/user', this.user2)
					}
					uni.navigateBack()
				}
			}
		}
	}
</script>

<style lang="scss">
	.name, .field-name, .field-size {
		margin-top: 40px;
		margin-left: 10px;
	}
	
	.father-mushu {
		height: 100%;
		width: 220px;
		.son-mushu {
			height: 100%;
			width: 100%;
		}
	}
	
	.father-name {
		height: 100%;
		width: 280px;
		.son-name {
			height: 100%;
			width: 100%;
		}
	}
</style>
