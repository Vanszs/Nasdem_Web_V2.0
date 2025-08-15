"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronRight, Users, MapPin, Building2, User, Phone, Mail } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface Kader {
  id: string
  full_name: string
  phone?: string
  address?: string
}

interface TPS {
  id: string
  name: string
  number: number
  coordinator?: {
    id: string
    full_name: string
    email: string
    phone?: string
  }
  kaders: Kader[]
}

interface Desa {
  id: string
  name: string
  code: string
  tps: TPS[]
}

interface Kecamatan {
  id: string
  name: string
  code: string
  desa: Desa[]
}

interface OrganizationStructureProps {
  data: Kecamatan[]
}

export default function OrganizationStructure({ data }: OrganizationStructureProps) {
  const [expandedKecamatan, setExpandedKecamatan] = useState<string[]>([])
  const [expandedDesa, setExpandedDesa] = useState<string[]>([])
  const [expandedTPS, setExpandedTPS] = useState<string[]>([])

  const toggleKecamatan = (id: string) => {
    setExpandedKecamatan((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const toggleDesa = (id: string) => {
    setExpandedDesa((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const toggleTPS = (id: string) => {
    setExpandedTPS((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  return (
    <div className="space-y-6">
      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-white border-l-4 border-l-nasdem-blue">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Kecamatan</p>
                <p className="text-2xl font-bold text-nasdem-blue">{data.length}</p>
              </div>
              <Building2 className="h-8 w-8 text-nasdem-blue" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-l-4 border-l-nasdem-orange">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Desa</p>
                <p className="text-2xl font-bold text-nasdem-orange">
                  {data.reduce((acc, kec) => acc + kec.desa.length, 0)}
                </p>
              </div>
              <MapPin className="h-8 w-8 text-nasdem-orange" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total TPS</p>
                <p className="text-2xl font-bold text-green-600">
                  {data.reduce((acc, kec) => acc + kec.desa.reduce((desaAcc, desa) => desaAcc + desa.tps.length, 0), 0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Kader</p>
                <p className="text-2xl font-bold text-purple-600">
                  {data.reduce(
                    (acc, kec) =>
                      acc +
                      kec.desa.reduce(
                        (desaAcc, desa) => desaAcc + desa.tps.reduce((tpsAcc, tps) => tpsAcc + tps.kaders.length, 0),
                        0,
                      ),
                    0,
                  )}
                </p>
              </div>
              <User className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Organization Tree */}
      <div className="space-y-4">
        {data.map((kecamatan) => (
          <Card key={kecamatan.id} className="bg-white shadow-lg">
            <Collapsible
              open={expandedKecamatan.includes(kecamatan.id)}
              onOpenChange={() => toggleKecamatan(kecamatan.id)}
            >
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {expandedKecamatan.includes(kecamatan.id) ? (
                        <ChevronDown className="h-5 w-5 text-nasdem-blue" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-nasdem-blue" />
                      )}
                      <Building2 className="h-6 w-6 text-nasdem-blue" />
                      <div>
                        <CardTitle className="text-xl text-nasdem-blue">Kecamatan {kecamatan.name}</CardTitle>
                        <p className="text-sm text-gray-600">
                          {kecamatan.desa.length} Desa •{" "}
                          {kecamatan.desa.reduce((acc, desa) => acc + desa.tps.length, 0)} TPS
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-nasdem-blue text-white">
                      {kecamatan.code}
                    </Badge>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="space-y-3 ml-8">
                    {kecamatan.desa.map((desa) => (
                      <Card key={desa.id} className="bg-gray-50">
                        <Collapsible open={expandedDesa.includes(desa.id)} onOpenChange={() => toggleDesa(desa.id)}>
                          <CollapsibleTrigger asChild>
                            <CardHeader className="cursor-pointer hover:bg-gray-100 transition-colors py-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  {expandedDesa.includes(desa.id) ? (
                                    <ChevronDown className="h-4 w-4 text-nasdem-orange" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4 text-nasdem-orange" />
                                  )}
                                  <MapPin className="h-5 w-5 text-nasdem-orange" />
                                  <div>
                                    <CardTitle className="text-lg text-nasdem-orange">Desa {desa.name}</CardTitle>
                                    <p className="text-sm text-gray-600">{desa.tps.length} TPS</p>
                                  </div>
                                </div>
                                <Badge variant="outline" className="bg-nasdem-orange text-white">
                                  {desa.code}
                                </Badge>
                              </div>
                            </CardHeader>
                          </CollapsibleTrigger>

                          <CollapsibleContent>
                            <CardContent className="pt-0">
                              <div className="space-y-2 ml-6">
                                {desa.tps.map((tps) => (
                                  <Card key={tps.id} className="bg-white border-l-4 border-l-green-500">
                                    <Collapsible
                                      open={expandedTPS.includes(tps.id)}
                                      onOpenChange={() => toggleTPS(tps.id)}
                                    >
                                      <CollapsibleTrigger asChild>
                                        <CardHeader className="cursor-pointer hover:bg-green-50 transition-colors py-2">
                                          <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                              {expandedTPS.includes(tps.id) ? (
                                                <ChevronDown className="h-4 w-4 text-green-600" />
                                              ) : (
                                                <ChevronRight className="h-4 w-4 text-green-600" />
                                              )}
                                              <Users className="h-4 w-4 text-green-600" />
                                              <div>
                                                <CardTitle className="text-base text-green-700">
                                                  {tps.name} (TPS {tps.number})
                                                </CardTitle>
                                                <p className="text-sm text-gray-600">
                                                  {tps.kaders.length} Kader
                                                  {tps.coordinator && ` • Koordinator: ${tps.coordinator.full_name}`}
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        </CardHeader>
                                      </CollapsibleTrigger>

                                      <CollapsibleContent>
                                        <CardContent className="pt-0">
                                          {/* Coordinator Info */}
                                          {tps.coordinator && (
                                            <div className="bg-blue-50 p-3 rounded-lg mb-3">
                                              <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                                                <User className="h-4 w-4 mr-2" />
                                                Koordinator TPS
                                              </h4>
                                              <div className="text-sm text-blue-700">
                                                <p className="font-medium">{tps.coordinator.full_name}</p>
                                                <div className="flex items-center mt-1 space-x-4">
                                                  <span className="flex items-center">
                                                    <Mail className="h-3 w-3 mr-1" />
                                                    {tps.coordinator.email}
                                                  </span>
                                                  {tps.coordinator.phone && (
                                                    <span className="flex items-center">
                                                      <Phone className="h-3 w-3 mr-1" />
                                                      {tps.coordinator.phone}
                                                    </span>
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          )}

                                          {/* Kaders List */}
                                          <div>
                                            <h4 className="font-semibold text-gray-800 mb-2">
                                              Daftar Kader ({tps.kaders.length})
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                              {tps.kaders.map((kader, index) => (
                                                <div key={kader.id} className="bg-gray-50 p-2 rounded text-sm">
                                                  <p className="font-medium text-gray-800">
                                                    {index + 1}. {kader.full_name}
                                                  </p>
                                                  {kader.phone && (
                                                    <p className="text-gray-600 flex items-center mt-1">
                                                      <Phone className="h-3 w-3 mr-1" />
                                                      {kader.phone}
                                                    </p>
                                                  )}
                                                  {kader.address && (
                                                    <p className="text-gray-600 text-xs mt-1">{kader.address}</p>
                                                  )}
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        </CardContent>
                                      </CollapsibleContent>
                                    </Collapsible>
                                  </Card>
                                ))}
                              </div>
                            </CardContent>
                          </CollapsibleContent>
                        </Collapsible>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>
    </div>
  )
}
