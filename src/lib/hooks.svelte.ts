import localforage from 'localforage'

export const useLocalForage = <T>(key: string, defaultValue: T): T => {
	let state = $state<T>(defaultValue)

	localforage.getItem<T>(key, (err, value) => {
		if (err) {
			console.error(err)
			return
		}

		state = value ?? state
	})

	$effect(() => {
		localforage.setItem(key, $state.snapshot(state))
	})

	return state
}
