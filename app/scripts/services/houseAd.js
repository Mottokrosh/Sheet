'use strict';

/**
 * House ad slot: one Mottokrosh Machinations title, picked at random per page
 * load, shown in the footer and the support strip. Add or remove titles by
 * editing `catalogue` below.
 *
 * Covers are local thumbnails in app/images/house-ads (160px wide, for a 72px
 * slot at 2x). They are deliberately excluded from grunt-rev in the Gruntfile:
 * usemin only rewrites asset paths in HTML and CSS, so a revved filename would
 * leave these references — built at runtime in JS — pointing at nothing.
 * Adding a cover means dropping a ~160px JPEG into that folder.
 */
angular.module('sheetApp')
	.factory('houseAd', function () {
		var site = 'https://mottokrosh.com';

		var catalogue = [
			{
				title: 'Knightcore',
				tagline: 'Battle darkness with steel and silk.',
				path: '/machinations/knightcore/',
				cover: 'images/house-ads/knightcore.jpg'
			},
			{
				title: 'Wolden',
				tagline: 'A forest RPG of wayward cults.',
				path: '/machinations/wolden/',
				cover: 'images/house-ads/wolden.jpg'
			},
			{
				title: 'Ultracosmic',
				tagline: 'A 56-page science fantasy zine.',
				path: '/machinations/ultracosmic/',
				cover: 'images/house-ads/ultracosmic.jpg'
			},
			{
				title: 'Hypertellurians',
				tagline: 'Fast science fantasy: low complexity, high depth.',
				path: '/machinations/hypertellurians/',
				cover: 'images/house-ads/hypertellurians.jpg'
			},
			{
				title: 'Capes and Cloaks and Cowls and a Park',
				tagline: 'A sandbox in a vanished wizard\'s theme park realm.',
				path: '/machinations/capes-and-cloaks/',
				cover: 'images/house-ads/capes-and-cloaks.jpg'
			},
			{
				title: 'The Eternal Grind Café',
				tagline: 'Minimum wage work as divine punishment.',
				path: '/machinations/the-eternal-grind-cafe/',
				cover: 'images/house-ads/eternal-grind-cafe.jpg'
			}
		];

		// utm_content distinguishes the two placements, so analytics can show
		// whether the footer or the support strip is actually doing the work.
		function link(item, placement) {
			return site + item.path +
				'?utm_source=charactersheet' +
				'&utm_medium=app' +
				'&utm_campaign=house_ad' +
				'&utm_content=' + placement;
		}

		return {
			pick: function () {
				var item = catalogue[Math.floor(Math.random() * catalogue.length)];

				return {
					title: item.title,
					tagline: item.tagline,
					cover: item.cover,
					footerUrl: link(item, 'footer'),
					stripUrl: link(item, 'strip')
				};
			}
		};
	});
