<template>
	<v-app>
		<v-app-bar app>
			<v-toolbar-title class="headline text-uppercase">
				<span>Dope Wars</span>
			</v-toolbar-title>
			<v-spacer></v-spacer>
			<span>v.1.4</span>
		</v-app-bar>

		<v-content>
			<router-view></router-view>
		</v-content>
	</v-app>
</template>

<script>
	export default {
		name: "App",
		components: {},
		data: () => ({})
	};
</script>
