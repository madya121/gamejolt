import Vue from 'vue';
import VueRouter from 'vue-router';
import { asyncComponentLoader } from '../../lib/gj-lib-client/utils/utils';
import { Component } from 'vue-property-decorator';
import * as View from '!view!./empty.html';

const fallback = () => asyncComponentLoader( $import( './fallback' ) );

@View
@Component({})
export default class RouteEmpty extends Vue
{
}

export const routeFallbacks: VueRouter.RouteConfig[] = [
	{ name: 'styleguide', path: '/styleguide', component: fallback },

	{ path: '/dashboard', component: RouteEmpty, children: [
		{ name: 'dashboard.main.overview', path: '/dashboard', component: RouteEmpty },
		{ name: 'dashboard.withdraw-funds', path: 'withdraw-funds', component: RouteEmpty },
		{ name: 'dashboard.developer.games.add', path: 'games/add', component: RouteEmpty },

		{ name: 'dashboard.account-mobile-nav', path: 'account/nav', component: RouteEmpty },
		{ name: 'dashboard.account.edit', path: 'profile/edit', component: RouteEmpty },
	] },
];
