import * as gui from 'nw.gui';
import Vue, { CreateElement } from 'vue';
import { Component } from 'vue-property-decorator';
import { Location } from 'vue-router';
import { Action, State } from 'vuex-class';

import { Screen } from '../../../../lib/gj-lib-client/components/screen/screen-service';
import { Store } from '../../../store/index';
import { UserTokenModal } from '../../user/token-modal/token-modal.service';
import { Client } from '../../../../_common/client/client.service';

const packagePrefix = GJ_BUILD_TYPE === 'production' ? '/package' : '';

let tray: gui.Tray | undefined;

@Component({})
export class AppClientTray extends Vue {
	@State app: Store['app'];
	@Action logout: Store['logout'];

	isFocused = false;
	isMinimized = false;
	isClosed = false;

	get section() {
		return /^\/auth\.html/.test(window.location.pathname) ? 'auth' : 'main';
	}

	/**
	 * Whether or not the app will actually quit when you tell it to or if it
	 * will do a soft quit.
	 */
	get isClientGreedy() {
		return this.section !== 'auth';
	}

	mounted() {
		const win = gui.Window.get();

		win.on('blur', () => (this.isFocused = false));
		win.on('focus', () => (this.isFocused = true));
		win.on('minimize', () => (this.isMinimized = true));
		win.on('restore', () => (this.isMinimized = false));

		win.on('close', () => {
			// If we should just minimize to tray instead of quitting.
			if (this.isClientGreedy) {
				this.isClosed = true;
				this.isMinimized = false;
				win.hide();
			} else {
				// Otherwise actually quit.
				Client.quit();
			}
		});
	}

	private toggleVisibility() {
		const win = gui.Window.get();

		if (this.isClosed || this.isMinimized || !this.isFocused) {
			Client.show();
			this.isClosed = false;
		} else {
			// If the window is being shown and is focused, let's minimize it.
			win.minimize();
		}
	}

	private go(location: Location) {
		this.$router.push(location);
		Client.show();
	}

	render(h: CreateElement) {
		// Changes to these will refresh the render function.
		const section = this.section;

		if (tray) {
			tray.remove();
			tray = undefined;
		}

		tray = new gui.Tray({
			title: 'Game Jolt Client',

			// We split this up so that it doesn't get injected.
			// It needs to stay as a relative file path or it will break.
			// TODO(client): This probably needs to use webpack and some testing.
			icon:
				packagePrefix +
				'/app/components/client/tray/' +
				(Screen.isHiDpi ? 'icon-2x.png' : 'icon.png'),
			click: () => this.toggleVisibility(),
		} as any);

		const menu = new gui.Menu();

		if (section !== 'auth') {
			menu.append(
				new gui.MenuItem({
					label: this.$gettext('Browse Games'),
					click: () =>
						this.go({
							name: 'discover.games.list._fetch',
							params: { section: 'featured' },
						}),
				})
			);

			menu.append(new gui.MenuItem({ type: 'separator' }));

			menu.append(
				new gui.MenuItem({
					label: 'Game Library',
					click: () => {
						this.go({ name: 'library.installed' });
						Client.show();
					},
				})
			);

			menu.append(
				new gui.MenuItem({
					label: 'Dashboard',
					click: () => {
						this.go({ name: 'dash.main.overview' });
						Client.show();
					},
				})
			);

			menu.append(
				new gui.MenuItem({
					label: 'Edit Account',
					click: () => {
						this.go({ name: 'dash.account.edit' });
						Client.show();
					},
				})
			);

			menu.append(
				new gui.MenuItem({
					label: 'Your Profile',
					click: () => {
						this.go({
							name: 'profile.overview',
							params: { username: this.app.user!.username },
						});
						Client.show();
					},
				})
			);

			menu.append(
				new gui.MenuItem({
					label: 'Your Game Token',
					click: () => {
						UserTokenModal.show();
						Client.show();
					},
				})
			);

			menu.append(
				new gui.MenuItem({
					label: 'Settings',
					click: () => {
						this.go({ name: 'settings' });
						Client.show();
					},
				})
			);

			menu.append(new gui.MenuItem({ type: 'separator' }));

			menu.append(
				new gui.MenuItem({
					label: 'Logout',
					click: () => {
						this.logout();
						Client.show();
					},
				})
			);
		}

		menu.append(
			new gui.MenuItem({
				label: 'Quit',
				click: () => {
					Client.quit();
				},
			})
		);

		tray.menu = menu;

		return h('div');
	}
}
