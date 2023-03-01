<template>
	<view>
		<form>
			<view class="name" style="display: flex;">
				<label for="name">姓名：{{user.name}}</label>
			</view>
			
			<view class="field-name" style="display: flex;">
				<label for="field-name">田地名：{{user.fieldName}}</label>
			</view>
			
			<view class="field-size" style="display: flex;">
				<label for="field-size">亩数：</label>
				<view class="father-mushu">
					<input type="digit" :value="user.fieldSize" placeholder="请输入亩数(未知可以先不输入)" id="field-size" class="son-mushu" @input="inputFieldSize">
				</view>
			</view>

		    <view class="btn-area">
				<button style="margin: 30rpx 0" type="primary" @click="submitForm">修改</button>
				<button style="margin: 30rpx 0" @click="quxiao">取消</button>
		    </view>
		</form>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				fieldName: '',
				fieldSize: 0,
				user: {
					name: '',
					fieldName: '',
					fieldSize: 0,
					done: 0
				}
			};
		},
		onLoad(options) {
			this.user.name = options.name
			this.user.fieldName = options.fieldName
			this.fieldName = options.fieldName
			this.user.fieldSize = options.fieldSize
			this.fieldSize = options.fieldSize
			this.user.done = options.done
		},
		methods: {
			inputFieldSize(e) {
				this.user.fieldSize = e.detail.value
			},
			
			async submitForm(e) {
				const {data: res} = await uni.$http.put('/fieldinfo', this.user)
				if(!res.flag) return uni.$showMsg()
				else {
					this.user.fieldName = ''
					this.user.fieldSize = 0
					uni.$showMsg("修改成功！")
					uni.navigateBack()
				}
			},
			quxiao() {
				this.user.fieldName = this.fieldName
				this.user.fieldSize = this.fieldSize
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
</style>
