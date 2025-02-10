<script lang="ts">
	import Uppy from '@uppy/core';
	import Dashboard from '@uppy/dashboard';
	import { onMount } from 'svelte';
	import ImageEditor from '@uppy/image-editor';

	let currentGroupUploaded = $state<number>();

	let uppy = $state<Uppy>();
	onMount(() => {
		uppy = new Uppy()
			.use(ImageEditor, {
				actions: {
					cropSquare: false,
					cropWidescreen: false,
					cropWidescreenVertical: false,
				},
				cropperOptions: {
					viewMode: 3,
					aspectRatio: 1,
				},
			})
			.use(Dashboard, {
				closeModalOnClickOutside: true,
				autoOpen: 'imageEditor',
				closeAfterFinish: true,
			});

		uppy!.on('complete', (result) => {
			if (!currentGroupUploaded || !result.successful) {
				console.error({ result, currentGroupUploaded });

				throw new Error('Error uploading files!');
			}

			groups[currentGroupUploaded].members.push(
				...result.successful.map((file) => ({
					name: file.name ?? '',
					image: URL.createObjectURL(file.data),
				}))
			);

			uppy!.clear();
		});
	});

	const openUploadModal = (groupIdx: number) => {
		currentGroupUploaded = groupIdx;
		(uppy!.getPlugin('Dashboard') as Dashboard<any, any>).openModal();
	};

	type Member = {
		name: string;
		image: string;
		description?: string;
	};

	type Group = {
		name: string;
		members: Member[];
	};

	let groups = $state<Group[]>([
		{
			name: 'Équipe Frontend',
			members: [
				{ name: 'Alice 4Bob', image: 'https://randomuser.me/api/portraits/lego/2.jpg' },
				{ name: 'Alice 1Bob', image: 'https://randomuser.me/api/portraits/lego/2.jpg' },
				{ name: 'Alice 2Bob', image: 'https://randomuser.me/api/portraits/lego/2.jpg' },
				{ name: 'Alice 5Bob', image: 'https://randomuser.me/api/portraits/lego/2.jpg' },
				{ name: 'Alice 3Bob', image: 'https://randomuser.me/api/portraits/lego/2.jpg' },
				{
					name: 'Alice 6BobBobBobBobBobBob',
					image: 'https://randomuser.me/api/portraits/lego/2.jpg',
				},
				{ name: 'Alice 8Bob', image: 'https://randomuser.me/api/portraits/lego/2.jpg' },
				{ name: 'Alice 7Bob', image: 'https://randomuser.me/api/portraits/lego/2.jpg' },
			],
		},
		{
			name: 'Équipe Backend',
			members: [
				{ name: 'Alice Dave', image: 'https://randomuser.me/api/portraits/lego/2.jpg' },
				{ name: 'Alice Charlie', image: 'https://randomuser.me/api/portraits/lego/2.jpg' },
			],
		},
	]);
</script>

<div class="flex flex-col gap-32">
	{#each groups as group, groupIdx}
		<div>
			<div class="flex w-full items-center justify-between border-b border-gray-700">
				<h2 class="text-3xl font-bold">{group.name}</h2>
				<div class="flex gap-2">
					<button
						onclick={() => openUploadModal(groupIdx)}
						class="cursor-pointer rounded-lg bg-blue-600 px-2 py-1 text-center text-xs font-medium text-white hover:bg-blue-800 focus:ring-4 focus:outline-none print:hidden"
					>
						Ajouter
					</button>
					<button
						onclick={() => group.members.sort((a, b) => a.name.localeCompare(b.name))}
						class="cursor-pointer rounded-lg bg-blue-600 px-2 py-1 text-center text-xs font-medium text-white hover:bg-blue-800 focus:ring-4 focus:outline-none print:hidden"
					>
						Trier A-Z
					</button>
				</div>
			</div>
			<div class="mt-4 flex flex-wrap gap-6">
				{#each group.members as member}
					<div
						class="w-40 rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
					>
						<img class="rounded-t-lg" src={member.image} alt={member.name} />
						<div class="gap-2 p-3">
							<h3
								contenteditable
								class="text-center text-xl font-bold tracking-tight text-wrap break-words text-gray-900"
								bind:textContent={member.name}
							></h3>
							{#if member.description}
								<p class="font-normal break-words text-gray-700 dark:text-gray-400">
									{member.description}
								</p>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/each}
</div>
