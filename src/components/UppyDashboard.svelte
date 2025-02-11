<script lang="ts">
	import Uppy from '@uppy/core'
	import { onMount } from 'svelte'
	import ImageEditor from '@uppy/image-editor'
	import Dashboard from '@uppy/dashboard'
	import type { UploadResult } from '@uppy/core/src/Uppy'
	import type { ClassValue } from 'svelte/elements'
	import locale from '@uppy/locales/lib/fr_FR'

	type Props = {
		onUploaded: (result: UploadResult<any, any>) => void
		onCancel: () => void
		class: ClassValue
	}
	let { onUploaded, onCancel, ...props }: Props = $props()

	let el: HTMLDivElement
	let uppy: Uppy

	onMount(() => {
		uppy = new Uppy({ locale, restrictions: { allowedFileTypes: ['image/*'] } })
			.use(ImageEditor, {
				actions: {
					cropSquare: false,
					cropWidescreen: false,
					cropWidescreenVertical: false,
				},
				cropperOptions: {
					viewMode: 2,
					aspectRatio: 1,
				},
			})
			.use(Dashboard, {
				height: 500,
				autoOpen: 'imageEditor',
				target: el,
				inline: true,
				proudlyDisplayPoweredByUppy: false,
			})
		// .use(DragDrop, {
		// 	target: 'div[data-group]',
		// onDrop(event) {
		// 	console.log(event)
		// },
		// })

		uppy!.on('complete', (result) => {
			onUploaded(result)

			uppy!.clear()
		})

		uppy!.on('cancel-all', () => {
			onCancel()

			uppy!.clear()
		})
	})
</script>

<div bind:this={el} {...props}></div>
