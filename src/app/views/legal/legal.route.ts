import { RouteConfig } from 'vue-router';

import { routeLegalPrivacy } from './privacy/privacy.route';
import { routeLegalTerms } from './terms/terms.route';

export const routeLegal: RouteConfig = {
	name: 'legal',
	path: '',
	props: true,
	component: () => import(/* webpackChunkName: "routeLegal" */ './legal'),
	children: [routeLegalPrivacy, routeLegalTerms],
};
