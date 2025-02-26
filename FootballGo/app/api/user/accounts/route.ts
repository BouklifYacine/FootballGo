import { prisma } from "@/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'UserId is required' }, { status: 400 })
  }

  const accounts = await prisma.account.findMany({
    where: { userId }
  })

  return NextResponse.json(accounts)
}