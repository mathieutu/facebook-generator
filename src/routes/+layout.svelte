<script lang="ts">
	import '../app.css'
	let { children } = $props()
</script>

<main class="not-print:bg-gray-50 not-print:p-6">
	<div class="mx-auto w-[210mm] rounded-lg bg-white not-print:p-6">
		{@render children()}
	</div>
	<p class="mt-4 text-right text-xs text-gray-400 italic print:hidden">
		Réalisé par <a class="cursor-pointer underline" href="https://github.com/mathieutu"
			>Mathieu TUDISCO</a
		>.
	</p>
</main>
