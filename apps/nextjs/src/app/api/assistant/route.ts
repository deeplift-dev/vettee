export async function GET(req: Request) {
  const body = await req.text();
  try {
    return new Response("OK", { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Invalid stripe webhook request", { status: 400 });
  }
}
