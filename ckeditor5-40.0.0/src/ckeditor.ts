/**
 * @license Copyright (c) 2014-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';

import { Alignment } from '@ckeditor/ckeditor5-alignment';
import { Bold, Code, Italic, Strikethrough, Underline } from '@ckeditor/ckeditor5-basic-styles';
import { CodeBlock } from '@ckeditor/ckeditor5-code-block';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { FindAndReplace } from '@ckeditor/ckeditor5-find-and-replace';
import { FontBackgroundColor, FontColor, FontFamily, FontSize } from '@ckeditor/ckeditor5-font';
import { HtmlEmbed } from '@ckeditor/ckeditor5-html-embed';
import { DataFilter, DataSchema, GeneralHtmlSupport } from '@ckeditor/ckeditor5-html-support';
import { Image, ImageInsert, ImageResize, ImageUpload } from '@ckeditor/ckeditor5-image';
import { Link } from '@ckeditor/ckeditor5-link';
import { MediaEmbed } from '@ckeditor/ckeditor5-media-embed';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { SourceEditing } from '@ckeditor/ckeditor5-source-editing';
import { Style } from '@ckeditor/ckeditor5-style';
import { Table } from '@ckeditor/ckeditor5-table';
import { WordCount } from '@ckeditor/ckeditor5-word-count';

// You can read more about extending the build with additional plugins in the "Installing plugins" guide.
// See https://ckeditor.com/docs/ckeditor5/latest/installation/plugins/installing-plugins.html for details.

class Editor extends ClassicEditor {
	public static override builtinPlugins = [
		Alignment,
		Bold,
		Code,
		CodeBlock,
		DataFilter,
		DataSchema,
		Essentials,
		FindAndReplace,
		FontBackgroundColor,
		FontColor,
		FontFamily,
		FontSize,
		GeneralHtmlSupport,
		HtmlEmbed,
		Image,
		ImageInsert,
		ImageResize,
		ImageUpload,
		Italic,
		Link,
		MediaEmbed,
		Paragraph,
		SourceEditing,
		Strikethrough,
		Style,
		Table,
		Underline,
		WordCount
	];

	public static override defaultConfig = {
		toolbar: {
			items: [
				'undo',
				'redo',
				'|',
				'fontSize',
				'fontColor',
				'fontBackgroundColor',
				'bold',
				'italic',
				'underline',
				'strikethrough',
				'link',
				'alignment',
				'|',
				'insertTable',
				'imageInsert',
				'mediaEmbed',
				'|',
				'sourceEditing',
				'style',
				'code',
				'codeBlock',
				'htmlEmbed',
				'findAndReplace'
			]
		},
		language: 'ko'
	};
}

export default Editor;
