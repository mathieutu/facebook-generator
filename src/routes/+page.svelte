<script lang="ts">
	import type { UploadResult } from '@uppy/core/src/Uppy'
	import UppyDashboard from '../components/UppyDashboard.svelte'
	import JSZip from 'jszip'
	import { ucFirst } from '$lib/strings.js'
	import localforage from 'localforage'

	type Member = {
		name: string
		image: File
		description?: string
	}

	type Group = {
		name: string
		members: Member[]
	}

	type Store = {
		title: string
		groups: Group[]
	}

	const defaultStore = (): Store => ({
		title: 'Trombinoscope',
		groups: [
			{ name: 'Stagiaires', members: [] },
			{ name: 'Encadrants', members: [] },
		],
	})

	let store = $state<Store>(defaultStore())

	localforage.getItem<Store>('store', (err, value) => {
		if (err) {
			console.error(err)
			return
		}

		if (value) {
			store = { ...store, ...value }
		}
	})

	$effect(() => {
		localforage.setItem('store', $state.snapshot(store))
	})

	let showUploads = $state(false)

	const onUpload = (group: Group) => (result: UploadResult<any, any>) => {
		if (!result.successful) {
			console.error({ result })

			throw new Error('Error uploading files!')
		}

		group.members.push(
			...result.successful.map((file) => ({
				name: ucFirst(file.name?.split('.').slice(0, -1).join('.') ?? ''),
				image: file.data as File,
			}))
		)

		showUploads = false
	}

	const downloadFiles = (group: Group) => () => {
		const zip = new JSZip()

		group.members.forEach((member) => {
			zip.file(`${member.name}.${member.image.name.split('.').pop()}`, member.image)
		})

		zip.generateAsync({ type: 'blob' }).then((blob) => {
			const url = URL.createObjectURL(blob)
			const a = document.createElement('a')

			a.download = `${group.name}.zip`
			a.href = url
			a.click()

			URL.revokeObjectURL(url)
		})
	}
</script>

<div class="flex flex-col gap-28">
	<div class="flex items-center justify-between">
		<h1
			class="text-5xl font-bold"
			data-gramm="false"
			spellcheck="false"
			data-ld-active="false"
			contenteditable
			bind:innerText={store.title}
		></h1>
		<div class="flex flex-col items-end gap-2 print:hidden">
			<button
				class="button bg-indigo-500 text-white hover:bg-indigo-600"
				onclick={() => window.print()}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="size-4"
					><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
						d="M14 3v4a1 1 0 0 0 1 1h4"
					/><path d="M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4" /><path
						d="M5 18h1.5a1.5 1.5 0 0 0 0 -3h-1.5v6"
					/><path d="M17 18h2" /><path d="M20 15h-3v6" /><path
						d="M11 15v6h1a2 2 0 0 0 2 -2v-2a2 2 0 0 0 -2 -2h-1z"
					/></svg
				>
				Imprimer</button
			>
			<button
				onclick={() => (store = defaultStore())}
				class="button border border-red-400 bg-white text-red-500 hover:border-red-600 hover:text-red-700"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="size-4"
					><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 7l16 0" /><path
						d="M10 11l0 6"
					/><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path
						d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"
					/></svg
				>
				Réinitialiser
			</button>
		</div>
	</div>
	{#each store.groups as group, groupIdx}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class={[{ 'break-inside-avoid': groupIdx }, { 'print:hidden': !group.members.length }]}>
			<div class="flex w-full items-center justify-between border-b border-gray-700">
				<h2
					class="text-3xl font-bold"
					data-gramm="false"
					spellcheck="false"
					data-ld-active="false"
					contenteditable
					bind:innerText={group.name}
				></h2>
				<div class="flex gap-2 print:hidden">
					{#if group.members.length}
						<button
							onclick={() => (showUploads = !showUploads)}
							class={[
								'button',
								'bg-blue-500 text-white hover:bg-blue-600',
								{ 'bg-blue-800': showUploads },
							]}
						>
							{#if showUploads}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="size-4"
									><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M15 8h.01" /><path
										d="M13 21h-7a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v7"
									/><path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l3 3" /><path
										d="M14 14l1 -1c.928 -.893 2.072 -.893 3 0"
									/><path d="M22 22l-5 -5" /><path d="M17 22l5 -5" /></svg
								>
								Fermer
							{:else}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="size-4"
									><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M15 8h.01" /><path
										d="M12.5 21h-6.5a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v6.5"
									/><path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l3.5 3.5" /><path
										d="M14 14l1 -1c.679 -.653 1.473 -.829 2.214 -.526"
									/><path d="M19 22v-6" /><path d="M22 19l-3 -3l-3 3" /></svg
								> Ajouter
							{/if}
						</button>
					{/if}
					<button
						onclick={() => group.members.sort((a, b) => a.name.localeCompare(b.name))}
						class="button border border-gray-400 bg-white text-gray-500 hover:border-gray-800 hover:text-gray-900"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="size-4"
							><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
								d="M15 10v-5c0 -1.38 .62 -2 2 -2s2 .62 2 2v5m0 -3h-4"
							/><path d="M19 21h-4l4 -7h-4" /><path d="M4 15l3 3l3 -3" /><path d="M7 6v12" /></svg
						>
						Trier
					</button>
					<button
						onclick={() => (group.members = [])}
						class="button border border-red-400 bg-white text-red-500 hover:border-red-600 hover:text-red-700"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="size-4"
							><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 7l16 0" /><path
								d="M10 11l0 6"
							/><path d="M14 11l0 6" /><path
								d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"
							/><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg
						>
						Vider
					</button>
					<button
						class="button border border-green-500 bg-white text-green-600 hover:border-green-700 hover:text-green-900"
						onclick={downloadFiles(group)}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="size-4"
							><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
								d="M12 21l-8 -4.5v-9l8 -4.5l8 4.5v4.5"
							/><path d="M12 12l8 -4.5" /><path d="M12 12v9" /><path d="M12 12l-8 -4.5" /><path
								d="M15 18h7"
							/><path d="M19 15l3 3l-3 3" /></svg
						>
						Exporter
					</button>
				</div>
			</div>
			<div
				class={['relative mt-4', { 'min-h-[500px]': showUploads || !group.members.length }]}
				ondragover={() => (showUploads = true)}
			>
				<div class="flex flex-wrap justify-start gap-6">
					{#each group.members as member, memberIdx}
						<div
							class="group relative w-42 break-inside-avoid rounded-lg border border-gray-200 bg-white not-print:shadow-sm dark:border-gray-700 dark:bg-gray-800"
						>
							<div
								class="absolute inset-0 hidden h-40 bg-gray-300/50 group-hover:block print:hidden"
							></div>
							<button
								class="absolute top-1 right-2 hidden cursor-pointer group-hover:block print:hidden"
								onclick={() => group.members.splice(memberIdx, 1)}
							>
								❌</button
							>
							<img
								class="h-40 w-full rounded-t-lg object-cover"
								src={typeof member.image === 'string'
									? member.image
									: URL.createObjectURL(member.image)}
								alt={member.name}
							/>
							<div class="p-3">
								<h3
									contenteditable
									data-gramm="false"
									spellcheck="false"
									data-ld-active="false"
									class="text-center text-xl font-bold tracking-tight text-wrap break-words text-gray-900 decoration-dotted group-hover:underline"
									bind:textContent={member.name}
								></h3>
							</div>
						</div>
					{/each}
				</div>
				<UppyDashboard
					class={[
						'absolute inset-0 h-full opacity-98 print:hidden',
						showUploads || !group.members.length ? 'block' : 'hidden',
					]}
					onUploaded={onUpload(group)}
					onCancel={() => (showUploads = false)}
				></UppyDashboard>
			</div>
		</div>
	{/each}
</div>
