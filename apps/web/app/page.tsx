import trpc from "../lib/trpc";

export default async function Home() {
	const res = await trpc.analyze.query();

	return <h1 className="text-3xl font-bold underline">{res}</h1>;
}
