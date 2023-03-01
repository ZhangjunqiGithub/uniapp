<template>
	<view>
		<my-search @click="gotoSearch"></my-search>
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true" :style="{height: screenHeight + 'px'}">
			<swiper-item>
				<image src="https://img.hookbase.com/img2017/4/19/2017041936981258.jpg"></image>
			</swiper-item>
			<swiper-item>
				<image src="https://images.yizhuomian.com/img/2020/12/29/6374485283460023639856703.jpg"></image>
			</swiper-item>
			<swiper-item>
				<image src="https://img.zcool.cn/community/01ceb75b1a5680a8012034f7c3d075.jpeg@520w_390h_1c_1e_1o_100sh.jpg"></image>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				screenHeight: 0
			};
		},
		onLoad() {
			this.screenHeight = uni.getSystemInfoSync().windowHeight - 50
		},
		methods: {
			gotoSearch() {
				uni.navigateTo({
					url: "/subpkg/search/search?type=0"
				})
			}
		}
	}
</script>

<style lang="scss">
	swiper {
		.swiper-item,
		image {
			width: 100%;
			height: 100%;
		}
	}
</style>
