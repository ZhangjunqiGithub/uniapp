<template>
	<view>
		<my-search bgcolor="#ffaaff" @click="gotoSearch"></my-search>
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true" :style="{height: screenHeight + 'px'}">
			<swiper-item>
				<image src="https://img.tukuppt.com/png_preview/00/15/19/txiCrxnJoX.jpg!/fw/780"></image>
			</swiper-item>
			<swiper-item>
				<image src="https://bpic.588ku.com/element_origin_min_pic/20/04/03/1aae28e5e35b1d15f23edfaf5b6c4fa9.jpg"></image>
			</swiper-item>
			<swiper-item>
				<image src="https://bpic.588ku.com/element_pic/20/06/30/e5053855c163d88c63e1eadedb8a3f79.jpg!/fw/253/quality/90/unsharp/true/compress/true"></image>
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
					url: '/subpkg/search/search?type=1'
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
