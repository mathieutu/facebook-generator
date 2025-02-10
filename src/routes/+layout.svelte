<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<main class="not-print:bg-gray-50 not-print:p-6">
	<div class="mx-auto w-[210mm] rounded-lg bg-white not-print:p-6">
		{@render children()}
	</div>
</main>
