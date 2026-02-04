import { UsersTable } from "@/app/components/users-table"
import { useUsersApi } from "@/hooks/use-users-api"

export default function UsersPage() {
  const { users, isLoading, error, refetch } = useUsersApi()

  return (
    <main className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Usuarios</h1>
        <p className="text-muted-foreground">
          Gestiona los usuarios de tu aplicación.
          {!isLoading && !error && (
            <span className="ml-2 text-sm">
              ({users.length} usuarios cargados desde la API)
            </span>
          )}
        </p>
      </div>

      <UsersTable 
        data={users} 
        isLoading={isLoading} 
        error={error} 
        onRefresh={refetch}
      />
    </main>
  )
}
