import { prisma } from "@/lib/prisma";

interface CreateAddressInput {
  label: string;
  recipientName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postcode: string;
  isDefault?: boolean;
}

interface UpdateAddressInput {
  label?: string;
  recipientName?: string;
  phone?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postcode?: string;
  isDefault?: boolean;
}

export async function getUserAddresses(userId: string) {
  return prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
  });
}

export async function createAddress(userId: string, data: CreateAddressInput) {
  // If this is the default, unset others
  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
  }
  // If first address, make it default
  const count = await prisma.address.count({ where: { userId } });

  return prisma.address.create({
    data: {
      ...data,
      userId,
      isDefault: data.isDefault ?? count === 0,
      line2: data.line2 || null,
    },
  });
}

export async function updateAddress(
  addressId: string,
  userId: string,
  data: UpdateAddressInput
) {
  const addr = await prisma.address.findFirst({
    where: { id: addressId, userId },
  });
  if (!addr) throw new Error("Address not found");

  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
  }

  return prisma.address.update({
    where: { id: addressId },
    data,
  });
}

export async function deleteAddress(addressId: string, userId: string) {
  const addr = await prisma.address.findFirst({
    where: { id: addressId, userId },
  });
  if (!addr) throw new Error("Address not found");

  return prisma.address.delete({ where: { id: addressId } });
}

export async function setDefaultAddress(addressId: string, userId: string) {
  const addr = await prisma.address.findFirst({
    where: { id: addressId, userId },
  });
  if (!addr) throw new Error("Address not found");

  await prisma.address.updateMany({
    where: { userId, isDefault: true },
    data: { isDefault: false },
  });

  return prisma.address.update({
    where: { id: addressId },
    data: { isDefault: true },
  });
}
