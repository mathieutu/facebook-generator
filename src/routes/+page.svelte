<script>
	export let groups = [
		{
			name: 'Équipe Frontend',
			members: [
				{ name: 'Alice Bob', image: 'https://randomuser.me/api/portraits/lego/2.jpg' },
				{ name: 'Alice Bob', image: 'https://randomuser.me/api/portraits/lego/2.jpg' },
				{ name: 'Alice Bob', image: 'https://randomuser.me/api/portraits/lego/2.jpg' },
				{ name: 'Alice Bob', image: 'https://randomuser.me/api/portraits/lego/2.jpg' },
				{ name: 'Alice Bob', image: 'https://randomuser.me/api/portraits/lego/2.jpg' },
				{
					name: 'Alice BobBobBobBobBobBob',
					image: 'https://randomuser.me/api/portraits/lego/2.jpg'
				},
				{ name: 'Alice Bob', image: 'https://randomuser.me/api/portraits/lego/2.jpg' },
				{ name: 'Alice Bob', image: 'https://randomuser.me/api/portraits/lego/2.jpg' }
			]
		},
		{
			name: 'Équipe Backend',
			members: [
				{ name: 'Alice Charlie', image: 'https://randomuser.me/api/portraits/lego/2.jpg' },
				{ name: 'Alice Dave', image: 'https://randomuser.me/api/portraits/lego/2.jpg' }
			]
		}
	];
</script>

<div class="flex flex-col gap-32">
	{#each groups as group}
		<div>
			<h2 class="border-b border-gray-700 text-3xl font-bold">{group.name}</h2>
			<div class="mt-4 flex flex-wrap gap-4">
				{#each group.members as member}
					<div
						class="w-40 rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
					>
						<img class="rounded-t-lg" src={member.image} alt={member.name} />
						<div class="gap-2 p-3">
							<h3 class="text-xl font-bold tracking-tight text-wrap break-words text-gray-900">
								{member.name}
							</h3>
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
