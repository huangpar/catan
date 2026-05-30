export async function GET() {
  return Response.json({
    hasDatabaseUrl: !!process.env.DATABASE_URL,
  });
}