export async function POST(req: Request) {
  const body = await req.text();

  console.log(body);
  try {
  } catch (err) {
    console.log(err);
    return new Response("Invalid stripe webhook request", { status: 400 });
  }

  return new Response("OK", { status: 200 });
}
