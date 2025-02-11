<script lang="ts">
	import * as localforage from 'localforage'
	import type { UploadResult } from '@uppy/core/src/Uppy'
	import UppyDashboard from '../components/UppyDashboard.svelte'

	type Member = {
		name: string
		image: string | File | Blob
		description?: string
	}

	type Group = {
		name: string
		members: Member[]
	}

	const emptyGroups = (): Group[] => [
		{ name: 'Stagiaires', members: [] },
		{ name: 'Encadrants', members: [] },
	]

	let groups = $state<Group[]>(emptyGroups())

	localforage.getItem<Group[]>('groups', (err, value) => {
		if (err) {
			console.error(err)
			return
		}

		groups = value ?? groups
	})

	$effect(() => {
		localforage.setItem('groups', $state.snapshot(groups))
	})

	let showUploads = $state(false)

	const onUpload = (groupIdx: keyof Group[]) => (result: UploadResult<any, any>) => {
		if (!result.successful) {
			console.error({ result })

			throw new Error('Error uploading files!')
		}

		;(groups[groupIdx] as Group).members.push(
			...result.successful.map((file) => ({
				name: file.name?.split('.').slice(0, -1).join('.') ?? '',
				image: file.data,
			}))
		)

		showUploads = false
	}
</script>

<div class="flex flex-col gap-28">
	{#each groups as group, groupIdx}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div>
			<div class="flex w-full items-center justify-between border-b border-gray-700">
				<h2 class="text-3xl font-bold" contenteditable bind:innerText={group.name}></h2>
				<div class="flex gap-2 print:hidden">
					{#if group.members.length}
						<button
							onclick={() => (showUploads = !showUploads)}
							class={[
								'inline-flex cursor-pointer items-center gap-1 rounded-lg bg-blue-500 px-2 py-1 text-center text-xs font-medium text-white hover:bg-blue-600 focus:outline-none',
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
						class="inline-flex cursor-pointer gap-1 rounded-lg border border-gray-400 bg-white px-2 py-1 text-center text-xs font-medium text-gray-500 hover:border-gray-800 hover:text-gray-900 focus:outline-none"
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
						class="inline-flex cursor-pointer gap-1 rounded-lg border border-red-400 bg-white px-2 py-1 text-center text-xs font-medium text-red-500 hover:border-red-600 hover:text-red-700 focus:outline-none"
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
				</div>
			</div>
			<div
				class={['relative mt-4', { 'min-h-[400px]': showUploads || !group.members.length }]}
				ondragover={() => (showUploads = true)}
			>
				<div class="flex flex-wrap justify-start gap-6">
					{#each group.members as member, memberIdx}
						<div
							class="group relative w-42 rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
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
								class="rounded-t-lg"
								src={typeof member.image === 'string'
									? member.image
									: URL.createObjectURL(member.image)}
								alt={member.name}
							/>
							<div class="flex items-center justify-center gap-2 p-3">
								<h3
									contenteditable
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
					onUploaded={onUpload(groupIdx)}
					onCancel={() => (showUploads = false)}
				></UppyDashboard>
			</div>
		</div>
	{/each}
</div>
