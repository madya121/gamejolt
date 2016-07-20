import { Injectable, Inject } from 'ng-metadata/core';
import { App } from './../../../../../../../app-service';
import { FormDashboardGameWizard } from './../../../../../../../components/forms/dashboard/game/wizard/wizard-service';

@Injectable()
export class DescriptionCtrl
{
	constructor(
		@Inject( 'App' ) app: App,
		@Inject( '$scope' ) private $scope: ng.IScope,
		@Inject( 'FormDashboardGameWizard' ) private wizard: FormDashboardGameWizard,
		@Inject( 'gettextCatalog' ) gettextCatalog: ng.gettext.gettextCatalog
	)
	{
		app.title = gettextCatalog.getString( 'Edit Description for {{ game }}', { game: $scope['manageCtrl'].game.title } );
	}

	onSaved( /*response: any*/ )
	{
		if ( this.$scope['manageCtrl'].isWizard ) {
			this.wizard.goNext();
			return;
		}

		// if ( response.wasPublished ) {
		// 	this.growls.success(
		// 		this.gettextCatalog.getString( 'dash.games.overview.published_growl' ),
		// 		this.gettextCatalog.getString( 'dash.games.overview.published_growl_title' )
		// 	);
		// }
		// else {
		// 	this.growls.success(
		// 		this.gettextCatalog.getString( 'dash.games.edit.save_growl' ),
		// 		this.gettextCatalog.getString( 'dash.games.edit.save_growl_title' )
		// 	);
		// }

		// this.scroll.to( 0 );
	}
}