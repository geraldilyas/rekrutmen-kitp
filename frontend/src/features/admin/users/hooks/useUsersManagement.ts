import { useState, useMemo, useCallback } from "react";
import type { User, UserFormData } from "../../types";

const initialUsers: User[] = [
  {
    id: 1,
    name: "Admin KITP",
    email: "admin@kitp.go.id",
    nik: "1871020101010001",
    phone: "081234567890",
    address: "Jl. Pangeran Antasari No. 15, Bandar Lampung",
    role: "admin",
    email_verified_at: "2025-01-15T08:30:00Z",
    created_at: "2025-01-15T08:30:00Z",
  },
  {
    id: 2,
    name: "Budi Santoso",
    email: "budi.santoso@kitp.go.id",
    nik: "1871020202020002",
    phone: "081345678901",
    address: "Jl. Laksamana Malahayati No. 22, Mesuji",
    role: "admin",
    email_verified_at: "2026-03-10T14:00:00Z",
    created_at: "2026-03-01T09:15:00Z",
  },
  {
    id: 3,
    name: "Rina Marlina",
    email: "rina.marlina@kitp.go.id",
    nik: "1871020303030003",
    phone: "081456789012",
    address: "Perumahan Griya Asri Blok B No. 8, Bandar Lampung",
    role: "admin",
    email_verified_at: null,
    created_at: "2026-04-05T11:20:00Z",
  },
];

export function useUsersManagement() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [filterVerification, setFilterVerification] = useState<string>("all");

  const filteredUsers = useMemo(() => {
    let result = users;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(q) ||
          user.email.toLowerCase().includes(q) ||
          user.nik?.toLowerCase().includes(q) ||
          user.phone?.toLowerCase().includes(q),
      );
    }

    if (filterVerification !== "all") {
      if (filterVerification === "verified") {
        result = result.filter((user) => user.email_verified_at !== null);
      } else {
        result = result.filter((user) => user.email_verified_at === null);
      }
    }

    return result;
  }, [users, search, filterVerification]);

  const addUser = useCallback((data: UserFormData) => {
    const newUser: User = {
      id: Date.now(),
      name: data.name,
      email: data.email,
      nik: data.nik || null,
      phone: data.phone || null,
      address: data.address || null,
      role: "admin",
      email_verified_at: null,
      created_at: new Date().toISOString(),
    };
    setUsers((prev) => [newUser, ...prev]);
  }, []);

  const editUser = useCallback((id: number, data: UserFormData) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? {
              ...user,
              name: data.name,
              email: data.email,
              nik: data.nik || null,
              phone: data.phone || null,
              address: data.address || null,
              updated_at: new Date().toISOString(),
            }
          : user,
      ),
    );
  }, []);

  const deleteUser = useCallback((id: number) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  }, []);

  const toggleVerification = useCallback((id: number) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? {
              ...user,
              email_verified_at: user.email_verified_at
                ? null
                : new Date().toISOString(),
            }
          : user,
      ),
    );
  }, []);

  return {
    users: filteredUsers,
    totalUsers: users.length,
    search,
    setSearch,
    filterVerification,
    setFilterVerification,
    addUser,
    editUser,
    deleteUser,
    toggleVerification,
  };
}
