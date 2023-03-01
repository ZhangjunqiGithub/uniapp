<template>
	<view class="my-search-container" :style="{'background-color':bgcolor}" @click="searchBoxHandler">
		<view class="my-search-box" :style="{'border-radius':radius + 'px'}">
			<uni-icons type="search" size="17"></uni-icons>
			<text class="placeholder">搜索</text>
		</view>
	</view>
</template>

<script>
	export default {
		name:"my-search",
		props: {
			bgcolor: {
				type: String,
				default: '#00ffff'
			},
			radius: {
				type: Number,
				default: 18
			}
		},
		data() {
			return {
				
			};
		},
		methods: {
			searchBoxHandler() {
				this.$emit('click')
			}
		}
	}
</script>

<style lang="scss">
.my-search-container {
	height: 50px;
	display: flex;
	align-items: center;
	padding: 0 10px;
	.my-search-box {
		height: 36px;
		background-color: #FFFFFF;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		.placeholder {
			font-size: 15px;
			margin-left: 5px;
		}
	}
}
</style>