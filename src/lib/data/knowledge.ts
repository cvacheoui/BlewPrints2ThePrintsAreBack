export class KnowledgeInstance {
	data: any;
	constructor(o: any) {
		this.data = o;
	}

	get id() {
		return this.data.id;
	}
	get name() {
		return this.data.name;
	}
	get location() {
		return this.data.location;
	}
	get description() {
		return this.data.description;
	}
	get parsedText() {
		return this.data.parsedText;
	}
	get magnifierParsedText() {
		return this.data.magnifierParsedText;
	}
	get pageNum() {
		return this.data.pageNum;
	}
	get comments() {
		return this.data.comments;
	}
	// Content tags come from the sheet's "Content Tags" column, parsed into a Set of plain labels.
	get contentTags(): Set<string> {
		return this.data.contentTags;
	}
	get image() {
		return `/images/knowledge/${this.id}.webp`;
	}
	getImage(index: number) {
		if (this.pageNum < 2) {
			return this.image;
		}
		return `/images/knowledge/${this.id}${index + 1}.webp`;
	}
	get link() {
		return `/knowledge/${this.id}`;
	}
	get foundIn() {
		return Objects.room.table.filter((r) => r.knowledgeItems.includes(this));
	}
}

import Objects from '.';
import excel from './excel/knowledge.csv?raw';
import { ExcelSchema, Field } from './lib/parse';

Objects.know = new ExcelSchema<KnowledgeInstance>(
	excel,
	[
		{ key: 'id', type: String },
		{ key: 'realName', type: String },
		{ key: 'name', type: String },
		{ key: 'location', type: Field.commaSeparatedSet },
		{ key: 'description', type: String },
		{ key: 'pageNum', type: Number },
		{ key: 'parsedText', type: String },
		{ key: 'magnifierParsedText', type: String },
		{ key: 'comments', type: String },
		// `coverage` (CSV column 9) is unused for now, but the parser maps fields by column
		// position (see lib/parse.ts), so it must be listed to keep `contentTags` aligned to column 10.
		{ key: 'coverage', type: String },
		// `contentTags`: plain comma-separated labels from the "Content Tags" column. Trim, drop
		// blanks, and de-duplicate into a Set so filtering can do fast membership checks.
		{
			key: 'contentTags',
			type: (s: string) =>
				new Set(
					s
						.split(',')
						.map((t) => t.trim())
						.filter(Boolean)
				)
		}
	],
	KnowledgeInstance
);
