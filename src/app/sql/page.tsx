"use client"
import { exec, run } from "@/modules/database"
import { useState, useEffect } from "react"

const Page = () => {
	const [results, setResults] = useState(null)
	const [query, setQuery] = useState("SELECT * FROM some_table;")
	
	const redraw = () => exec(query).then(data => setResults(data[0]))

	useEffect(() => {
		redraw()
	}, [])

	return (
		<section>
			<textarea onChange={evt => setQuery(evt.target.value)} value={query} />
			<button onClick={() => run('DROP TABLE IF EXISTS some_table;')}>drop</button>
			<button onClick={() => run('CREATE TABLE IF NOT EXISTS some_table (id INTEGER PRIMARY KEY AUTOINCREMENT, value TEXT);') && redraw()}>create</button>
			<button onClick={() => {
				run(`INSERT INTO some_table VALUES (NULL, ${Math.random().toString()});`);
				redraw();
			}}>insert</button>
			<button onClick={() => run('DELETE FROM some_table;') && redraw()}>clear</button>
			<button onClick={() => exec(query).then(data => setResults(data[0]))}>execute</button>
			{results ?
				<table>
					<thead>
						<tr>{results.columns.map((column, index) => <th key={index}>{column}</th>)}</tr>
					</thead>
					<tbody>
						{results.values.map((row, index) =>
						<tr key={index}>
							{row.map((cell, index) => <td key={index}>{cell}</td>)}
						</tr>)}
					</tbody>
				</table> : null}
		</section>
	)
}

export default Page
