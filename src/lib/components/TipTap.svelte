<script>
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import Document from '@tiptap/extension-document';
	import Paragraph from '@tiptap/extension-paragraph';
	import Text from '@tiptap/extension-text';
	import Strike from '@tiptap/extension-strike';

	import StarterKit from '@tiptap/starter-kit';

	let element;
	let editor;

	onMount(() => {
		editor = new Editor({
			// bind Tiptap to `.element`
			element: element,
			// register extensions
			extensions: [Document, Text, Strike, Paragraph],
			// set the initial content
			content: '<p>Example Text</p>',
			// place the cursor in the editor after initialization
			autofocus: false,
			// make the text editable (but that’s the default anyway)
			editable: true,
			// disable the loading of the default CSS (which is not much anyway)
			injectCSS: false,
			editorProps: {
				attributes: {
					class:
						'prose prose-sm sm:prose h-full lg:prose-lg xl:prose-2xl mx-auto focus:outline-none'
				}
			},

			onTransaction: () => {
				// force re-render so `editor.isActive` works as expected
				editor = editor;
			}
		});
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});
	// $: console.log(editor.chain());
</script>

<div>
	<div class="border-2 min-h-[150px] h-full rounded-lg" bind:this={element} />
	<div class="control-group">
		{#if editor}
			<div class="flex gap-2 items-center button-group">
				<button
					on:click={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
					class:active={editor.isActive('heading', { level: 1 })}
				>
					H1
				</button>
				<button
					on:click={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
					class:active={editor.isActive('heading', { level: 2 })}
				>
					H2
				</button>
				<button
					on:click={() => editor.chain().focus().setParagraph().run()}
					class:active={editor.isActive('paragraph')}
				>
					P
				</button>
				<button on:click={editor.chain().focus().toggleBold().run()}>Bold</button>
			</div>
		{/if}
	</div>
</div>

<style>
	button.active {
		background: black;
		color: white;
	}
</style>
