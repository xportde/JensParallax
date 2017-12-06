/*
 * NOTICE OF LICENSE
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 * @author     Tobias Walter <tw@xport.de>, Rico Dang <rd@xport.de>
 * @copyright  2017 Tobias Walter, Rico Dang
 * @version    0.1.0 beta
 * @date       15/11/2017
 */

(function($)
{
	//{{{ $.fn.JensSwipe
	$.fn.extend(
	{
		JensParallax: function(options)
		{
			return this.each(function() {
				new $.JensParallax(this, options);
			});
		}
	}); //}}}

	//{{{ $.ParaLachs
	$.JensParallax = function(domElem, options)
	{
		//{{{ global defines
		this.jens      = $(domElem);
		this.options   = options;
		this.opts      = $.extend({}, this.DEFAULT_OPTS, this.options);
		this.elemIndex = this.jens.index();
		//}}}
		this.init();
	}; //}}}

	$.JensParallax.prototype =
	{
		JENS_STAGE_CLASS: 'jensParallax',
		IMAGE_CLASS: 'parallaxImage',
		DEFAULT_OPTS: {
			height: null,
		},

		//{{{ init() function
		init: function()
		{
			var self = this;
			self.jens.addClass(self.JENS_STAGE_CLASS);
			self.prepareParallax();

			$(document).ready(function() {
				self.parallax();
			});

			$(window).on({
				scroll: function()
				{
					self.parallax();
				},
				load: function()
				{
					setTimeout(function() { self.parallax(); }, 50);
				},
				resize: function()
				{
					self.parallax();
				}
			});
		},

		prepareParallax: function()
		{
			var self          = this
			  , parallaxImage = self.jens.find('.' + self.IMAGE_CLASS);

			self.jens.css({
				height: self.opts.height
			});

			if (parallaxImage.width() > parallaxImage.parent().width())
			{
				parallaxImage.css({
					'left': '50%',
					'margin-left': '-' + (parallaxImage.width() / 2) + 'px'
				});
			}
			else
			{
				parallaxImage.css({
					'left': '0%',
					'margin-left': '0px'
				});
			}
		},

		parallax: function()
		{
			var self = this;

			self.jens.each(function()
			{
				$(this).find('.' + self.IMAGE_CLASS).css({
					'position': 'absolute',
					'bottom': '-' + self.parallaxCalc($(this)) + 'px'
				});
			});
		},

		parallaxCalc: function(elem)
		{
			var self         = this
			  , elOffsetTop  = elem.offset().top
			  , elHeight     = elem.height()
			  , winHeight    = $(window).height()
			  , winScrollTop = $(window).scrollTop();

			if (elOffsetTop < (winScrollTop + winHeight)
					&& (elOffsetTop + elHeight) > winScrollTop)
			{
				var viewportPC = Math.abs(((elOffsetTop - (winScrollTop + winHeight)) / (elHeight + winHeight)) * 100);
				return Math.abs((viewportPC / 100) * (elem.find('.' + self.IMAGE_CLASS).height() - elHeight));
			}
			else
				return 0;
		}
	};

})(jQuery);
